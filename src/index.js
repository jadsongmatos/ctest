#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const {
  generateSBOM,
  readSBOM,
  extractComponents,
} = require('./lib/sbom');
const {
  downloadRepos,
} = require('./lib/repo-downloader');
const {
  scanSourceFiles,
  analyzeSourceFile,
} = require('./lib/source-analyzer');
const {
  ensureHorsebox,
  buildFileContentIndex,
  buildFileLineIndex,
} = require('./lib/horsebox');
const {
  writeMarkdownForSource,
} = require('./lib/markdown-generator');

/**
 * Creates a filtered copy of the project directory, excluding problematic folders
 * to avoid Horsebox indexing errors.
 */
function createFilteredProjectCopy(projectPath, workRoot) {
  const filteredDir = path.join(workRoot, 'filtered-project');
  fs.mkdirSync(filteredDir, { recursive: true });

  // Directories and patterns to exclude
  const excludePatterns = [
    'node_modules',
    'ctest',
    '.git',
    'coverage',
    'ref',
    '.vscode',
    '.idea',
    '*.log',
    '*.db',
    '*.cdx.json',
  ];

  // Build rsync exclude arguments
  const excludeArgs = excludePatterns.flatMap(pattern => ['--exclude', pattern]);

  try {
    // Use rsync to copy only relevant files (respects .gitignore implicitly by excluding common patterns)
    // Using spawnSync instead of execSync to avoid shell injection vulnerabilities
    const rsyncArgs = [
      '-av',
      `--filter=':- .gitignore'`,
      ...excludeArgs,
      `${projectPath}/`,
      `${filteredDir}/`,
    ];
    const result = spawnSync('rsync', rsyncArgs, {
      stdio: 'pipe',
      timeout: 60000, // 1 minute timeout
    });
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(`rsync exited with code ${result.status}`);
    }
  } catch (error) {
    // Fallback: simple copy if rsync fails
    console.warn('rsync failed, using fallback copy method...');
    copyDirectoryRecursive(projectPath, filteredDir, excludePatterns);
  }

  return filteredDir;
}

/**
 * Fallback recursive copy that excludes specified patterns
 */
function copyDirectoryRecursive(src, dst, excludePatterns) {
  fs.mkdirSync(dst, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);

    // Skip excluded directories
    if (excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
        return regex.test(entry.name);
      }
      return entry.name === pattern;
    })) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, dstPath, excludePatterns);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

async function analyze(projectPath, options = {}) {
  const {
    sbomPath = 'sbom.cdx.json',
    sourceFile,
    downloadDependencies = false,
    maxDownloads = -1,
    respectGitIgnore = true,
    downloadDir = null,
    directOnly = false,
  } = options;

  const resolvedProjectPath = path.resolve(projectPath || process.cwd());

  if (!fs.existsSync(resolvedProjectPath)) {
    throw new Error(`Project path does not exist: ${resolvedProjectPath}`);
  }

  ensureHorsebox();

  console.log('Generating SBOM...');
  const generatedSbomPath = await generateSBOM(resolvedProjectPath, sbomPath, true, directOnly);

  console.log('Reading SBOM...');
  const sbom = readSBOM(generatedSbomPath);
  const allComponents = extractComponents(sbom).filter(c => c.repo_url);
  console.log(`Found ${allComponents.length} components with repo_url`);

  let downloadInfo = { downloadRoot: null, results: {} };

  if (downloadDependencies) {
    const componentsToDownload = maxDownloads > 0
      ? allComponents.slice(0, maxDownloads)
      : allComponents;
    const countDesc = maxDownloads > 0
      ? `up to ${maxDownloads}`
      : 'all';
    console.log(`Downloading ${countDesc} dependency repositories...`);
    
    // Resolve downloadDir relative to projectPath if it's provided and relative
    let resolvedDownloadDir = downloadDir;
    if (downloadDir && !path.isAbsolute(downloadDir)) {
      resolvedDownloadDir = path.resolve(resolvedProjectPath, downloadDir);
    }

    downloadInfo = await downloadRepos(componentsToDownload, {
      baseDir: resolvedDownloadDir,
    });
  }

  // Use download directory for Horsebox indexes if available, otherwise use temp directory
  const workRoot = downloadInfo.downloadRoot
    ? downloadInfo.downloadRoot
    : fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-work-'));

  const projectIndexDir = path.join(workRoot, '.horsebox', 'index-project-files');
  const libsIndexDir = path.join(workRoot, '.horsebox', 'index-libs-files');
  const libsLineIndexDir = path.join(workRoot, '.horsebox', 'index-libs-lines');

  // Create index directories
  fs.mkdirSync(projectIndexDir, { recursive: true });
  fs.mkdirSync(libsIndexDir, { recursive: true });
  fs.mkdirSync(libsLineIndexDir, { recursive: true });

  // Create filtered project copy to avoid indexing node_modules and other problematic directories
  console.log('Creating filtered project copy (excluding node_modules, ctest/, etc.)...');
  const filteredProjectPath = createFilteredProjectCopy(resolvedProjectPath, path.join(workRoot, '.horsebox'));

  console.log('Building Horsebox index for project source files...');
  // Check if project index already exists and has content
  const projectIndexExists = fs.existsSync(projectIndexDir) && 
    fs.readdirSync(projectIndexDir).length > 0;
  
  if (projectIndexExists) {
    console.log('Project index already exists, skipping build...');
  } else {
    buildFileContentIndex(filteredProjectPath, projectIndexDir);
  }

  if (downloadInfo.downloadRoot && fs.existsSync(downloadInfo.downloadRoot)) {
    // Check if any repositories were successfully downloaded
    const successfulDownloads = Object.values(downloadInfo.results).filter(r => r.success);
    if (successfulDownloads.length > 0) {
      console.log(`Building Horsebox index for ${successfulDownloads.length} downloaded dependencies...`);
      try {
        // Check if lib indexes already exist and have content
        const libsIndexExists = fs.existsSync(libsIndexDir) && 
          fs.readdirSync(libsIndexDir).length > 0;
        const libsLineIndexExists = fs.existsSync(libsLineIndexDir) && 
          fs.readdirSync(libsLineIndexDir).length > 0;
        
        if (!libsIndexExists) {
          buildFileContentIndex(downloadInfo.downloadRoot, libsIndexDir);
        } else {
          console.log('Libs filecontent index already exists, skipping build...');
        }
        
        if (!libsLineIndexExists) {
          buildFileLineIndex(downloadInfo.downloadRoot, libsLineIndexDir);
        } else {
          console.log('Libs fileline index already exists, skipping build...');
        }
      } catch (error) {
        console.warn(`Warning: Failed to build index for dependencies: ${error.message}`);
        console.warn('Continuing without dependency tests...');
      }
    } else {
      console.log('No dependencies were successfully downloaded, skipping dependency index...');
    }
  }

  // Determine directories to exclude from scanning (e.g., downloadDir if inside projectPath)
  const excludeDirs = [];
  if (downloadInfo.downloadRoot) {
    const relDownloadPath = path.relative(resolvedProjectPath, downloadInfo.downloadRoot);
    if (!relDownloadPath.startsWith('..') && !path.isAbsolute(relDownloadPath)) {
      // It's inside the project
      excludeDirs.push(relDownloadPath.split(path.sep)[0]);
    }
  }

  const sourceFiles = sourceFile
    ? [path.resolve(resolvedProjectPath, sourceFile)]
    : scanSourceFiles(resolvedProjectPath, { respectGitIgnore, excludeDirs });

  const generated = [];

  for (const file of sourceFiles) {
    if (!fs.existsSync(file)) {
      console.warn(`Skipping missing file: ${file}`);
      continue;
    }

    console.log(`Generating markdown for: ${path.relative(resolvedProjectPath, file)}`);

    const usage = analyzeSourceFile(file);
    const outputFile = `${file}.md`;

    await writeMarkdownForSource({
      sourceFile: file,
      usage,
      outputFile,
      libsIndexDir,
      libsLineIndexDir,
      projectRoot: resolvedProjectPath,
    });

    generated.push(path.relative(resolvedProjectPath, outputFile));
  }

  // Generate a global checklist for tracking progress
  if (generated.length > 0) {
    const checklistPath = path.join(resolvedProjectPath, 'CTEST_CHECKLIST.md');
    let checklistMd = '# CTest Analysis Checklist\n\n';
    checklistMd += `Generated on: ${new Date().toLocaleString()}\n\n`;
    checklistMd += 'Use this file to track your progress reviewing the generated external tests.\n\n';
    
    for (const relPath of generated) {
      // Create a relative link to the markdown file
      checklistMd += `- [ ] [${relPath}](${relPath})\n`;
    }

    fs.writeFileSync(checklistPath, checklistMd, 'utf8');
    console.log(`\nGlobal checklist created: ${path.relative(process.cwd(), checklistPath)}`);
  }

  return {
    sbomPath: generatedSbomPath,
    generated,
    downloadRoot: downloadInfo.downloadRoot,
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const projectPath = args[0] || process.cwd();
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const downloadFlag = args.includes('--download-dependencies');
  const directOnlyFlag = args.includes('--direct-only');
  const maxDownloadsArg = args.find(arg => arg.startsWith('--max-downloads='));
  const respectGitIgnoreArg = args.find(arg => arg.startsWith('--respect-gitignore='));
  const downloadDirArg = args.find(arg => arg.startsWith('--download-dir='));

  // Default is true, only false if explicitly set to false
  let respectGitIgnore = true;
  if (respectGitIgnoreArg) {
    const value = respectGitIgnoreArg.split('=')[1].toLowerCase();
    respectGitIgnore = value !== 'false' && value !== '0' && value !== 'no';
  }

  const downloadDir = downloadDirArg ? downloadDirArg.split('=')[1] : null;

  analyze(projectPath, {
    sourceFile: fileArg ? fileArg.split('=')[1] : undefined,
    downloadDependencies: downloadFlag,
    maxDownloads: maxDownloadsArg ? parseInt(maxDownloadsArg.split('=')[1], 10) : -1,
    respectGitIgnore,
    downloadDir,
    directOnly: directOnlyFlag,
  })
    .then(result => {
      console.log(`\nDone. Generated ${result.generated.length} markdown files.`);
      if (result.downloadRoot) {
        console.log(`Dependencies available at: ${result.downloadRoot}`);
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = { analyze };

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  generateSBOM,
  readSBOM,
  extractComponents,
} = require('./lib/sbom');
const {
  downloadRepos,
  cleanupRepos,
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

async function analyze(projectPath, options = {}) {
  const {
    sbomPath = 'sbom.cdx.json',
    sourceFile,
    downloadDependencies = false,
    maxDownloads = -1,
    respectGitIgnore = true,
  } = options;

  const resolvedProjectPath = path.resolve(projectPath || process.cwd());

  if (!fs.existsSync(resolvedProjectPath)) {
    throw new Error(`Project path does not exist: ${resolvedProjectPath}`);
  }

  ensureHorsebox();

  console.log('Generating SBOM...');
  const generatedSbomPath = await generateSBOM(resolvedProjectPath, sbomPath, true);

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
    downloadInfo = await downloadRepos(componentsToDownload);
  }

  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ctest-work-'));
  const projectIndexDir = path.join(workRoot, 'index-project-files');
  const libsIndexDir = path.join(workRoot, 'index-libs-files');
  const libsLineIndexDir = path.join(workRoot, 'index-libs-lines');

  console.log('Building Horsebox index for project source files...');
  buildFileContentIndex(resolvedProjectPath, projectIndexDir);

  if (downloadInfo.downloadRoot && fs.existsSync(downloadInfo.downloadRoot)) {
    console.log('Building Horsebox index for dependency source files...');
    buildFileContentIndex(downloadInfo.downloadRoot, libsIndexDir);
    buildFileLineIndex(downloadInfo.downloadRoot, libsLineIndexDir);
  }

  const sourceFiles = sourceFile
    ? [path.resolve(resolvedProjectPath, sourceFile)]
    : scanSourceFiles(resolvedProjectPath, { respectGitIgnore });

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
    });

    generated.push(path.relative(resolvedProjectPath, outputFile));
  }

  if (downloadInfo.downloadRoot) {
    cleanupRepos(downloadInfo.downloadRoot);
  }

  return {
    sbomPath: generatedSbomPath,
    generated,
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const projectPath = args[0] || process.cwd();
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const downloadFlag = args.includes('--download-dependencies');
  const maxDownloadsArg = args.find(arg => arg.startsWith('--max-downloads='));
  const respectGitIgnoreArg = args.find(arg => arg.startsWith('--respect-gitignore='));

  // Default is true, only false if explicitly set to false
  let respectGitIgnore = true;
  if (respectGitIgnoreArg) {
    const value = respectGitIgnoreArg.split('=')[1].toLowerCase();
    respectGitIgnore = value !== 'false' && value !== '0' && value !== 'no';
  }

  analyze(projectPath, {
    sourceFile: fileArg ? fileArg.split('=')[1] : undefined,
    downloadDependencies: downloadFlag,
    maxDownloads: maxDownloadsArg ? parseInt(maxDownloadsArg.split('=')[1], 10) : -1,
    respectGitIgnore,
  })
    .then(result => {
      console.log(`\nDone. Generated ${result.generated.length} markdown files.`);
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = { analyze };

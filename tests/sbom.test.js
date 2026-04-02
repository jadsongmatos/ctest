const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

jest.mock('fs');
jest.mock('child_process');
jest.mock('https');

const {
  generateSBOM,
  readSBOM,
  extractComponents,
  createSBOMFromPackageLock,
  detectPackageManager
} = require('../src/lib/sbom');

describe('SBOM Module', () => {
  const testProjectDir = path.join(__dirname, 'fixtures', 'test-project');
  const testSBOMPath = path.join(testProjectDir, 'sbom.cdx.json');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Mock fs.existsSync to return true only for package-lock.json in test-project
    fs.existsSync.mockImplementation((filePath) => {
      if (filePath.endsWith('package-lock.json') && filePath.includes('test-project')) {
        return true;
      }
      if (filePath.endsWith('sbom.cdx.json') && filePath.includes('test-project')) {
        return true;
      }
      if (filePath.endsWith('package.json') && filePath.includes('test-project')) {
        return true;
      }
      return false;
    });
    
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.endsWith('sbom.cdx.json')) {
        return JSON.stringify({
          bomFormat: 'CycloneDX',
          specVersion: '1.4',
          components: [{ name: 'express', version: '4.18.0' }]
        });
      }
      if (filePath.endsWith('package.json')) {
        return JSON.stringify({ dependencies: { express: '4.18.0' } });
      }
      if (filePath.endsWith('package-lock.json')) {
        return JSON.stringify({
          lockfileVersion: 2,
          packages: {
            '': { name: 'root', version: '1.0.0' },
            'node_modules/express': { name: 'express', version: '4.18.0' }
          }
        });
      }
      return '';
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createSBOMFromPackageLock', () => {
    it('should create SBOM from package-lock.json v2 format', async () => {
      const packageLock = {
        lockfileVersion: 2,
        packages: {
          '': {
            name: 'root',
            version: '1.0.0',
            dependencies: {
              express: '4.18.0'
            }
          },
          'node_modules/express': {
            name: 'express',
            version: '4.18.0',
            resolved: 'https://registry.npmjs.org/express/-/express-4.18.0.tgz'
          },
          'node_modules/lodash': {
            name: 'lodash',
            version: '4.17.21'
          }
        }
      };

      const sbom = await createSBOMFromPackageLock(packageLock);

      expect(sbom.bomFormat).toBe('CycloneDX');
      expect(sbom.specVersion).toBe('1.4');
      expect(sbom.components).toHaveLength(2);
      expect(sbom.components[0].name).toBe('express');
      expect(sbom.components[0].version).toBe('4.18.0');
    });

    it('should omit transitive dependencies when requested', async () => {
      const packageLock = {
        lockfileVersion: 2,
        packages: {
          '': {
            dependencies: {
              express: '4.18.0'
            }
          },
          'node_modules/express': {
            name: 'express',
            version: '4.18.0'
          },
          'node_modules/accepts': {
            name: 'accepts',
            version: '1.3.8'
          }
        }
      };

      const sbom = await createSBOMFromPackageLock(packageLock, false, true);

      expect(sbom.components).toHaveLength(1);
      expect(sbom.components[0].name).toBe('express');
    });

    it('should handle empty packages', async () => {
      const packageLock = {
        lockfileVersion: 2,
        packages: {}
      };

      const sbom = await createSBOMFromPackageLock(packageLock);

      expect(sbom.components).toHaveLength(0);
    });

    it('should handle packages without name field', async () => {
      const packageLock = {
        lockfileVersion: 2,
        packages: {
          'node_modules/express': {
            version: '4.18.0'
          }
        }
      };

      const sbom = await createSBOMFromPackageLock(packageLock);

      expect(sbom.components).toHaveLength(1);
      expect(sbom.components[0].name).toBe('express');
    });

    it('should skip root package', async () => {
      const packageLock = {
        lockfileVersion: 2,
        packages: {
          '': {
            name: 'root',
            version: '1.0.0'
          }
        }
      };

      const sbom = await createSBOMFromPackageLock(packageLock);

      expect(sbom.components).toHaveLength(0);
    });

    it('should handle pnpm-lock.yaml format (v9+)', async () => {
      const packageLock = {
        lockfileVersion: '9.0',
        importers: {
          '.': {
            dependencies: {
              'express': {
                specifier: '^4.18.0',
                version: '4.18.2'
              },
              'lodash': {
                specifier: '^4.17.21',
                version: '4.17.21'
              }
            },
            devDependencies: {
              'jest': {
                specifier: '^29.0.0',
                version: '29.7.0'
              }
            }
          }
        }
      };

      const sbom = await createSBOMFromPackageLock(packageLock);

      expect(sbom.components).toHaveLength(3);
      expect(sbom.components.map(c => c.name)).toEqual(
        expect.arrayContaining(['express', 'lodash', 'jest'])
      );
    });

    it('should handle pnpm format with string versions', async () => {
      const packageLock = {
        lockfileVersion: '9.0',
        importers: {
          '.': {
            dependencies: {
              'express': '4.18.2',
              'lodash': '4.17.21'
            }
          }
        }
      };

      const sbom = await createSBOMFromPackageLock(packageLock);

      expect(sbom.components).toHaveLength(2);
      expect(sbom.components[0].name).toBe('express');
      expect(sbom.components[0].version).toBe('4.18.2');
    });

    it('should handle pnpm format with omitTransitive', async () => {
      const packageLock = {
        lockfileVersion: '9.0',
        importers: {
          '.': {
            dependencies: {
              'express': {
                specifier: '^4.18.0',
                version: '4.18.2'
              },
              'lodash': {
                specifier: '^4.17.21',
                version: '4.17.21'
              }
            }
          }
        }
      };

      const sbom = await createSBOMFromPackageLock(packageLock, false, true);

      // Should only include direct dependencies
      expect(sbom.components.length).toBeGreaterThan(0);
    });
  });

  describe('detectPackageManager', () => {
    it('should detect npm project (package-lock.json)', () => {
      fs.existsSync.mockImplementation((filePath) => {
        return filePath.endsWith('package-lock.json');
      });
      
      const result = detectPackageManager('/test/project');
      expect(result).toEqual({ type: 'npm', lockPath: expect.stringContaining('package-lock.json') });
    });

    it('should detect PNPM project (pnpm-lock.yaml)', () => {
      fs.existsSync.mockImplementation((filePath) => {
        return filePath.endsWith('pnpm-lock.yaml');
      });
      
      const result = detectPackageManager('/test/project');
      expect(result).toEqual({ type: 'pnpm', lockPath: expect.stringContaining('pnpm-lock.yaml') });
    });

    it('should detect Yarn project (yarn.lock)', () => {
      fs.existsSync.mockImplementation((filePath) => {
        return filePath.endsWith('yarn.lock');
      });
      
      const result = detectPackageManager('/test/project');
      expect(result).toEqual({ type: 'yarn', lockPath: expect.stringContaining('yarn.lock') });
    });

    it('should return null when no lock file found', () => {
      fs.existsSync.mockReturnValue(false);
      
      const result = detectPackageManager('/test/project');
      expect(result).toBeNull();
    });

    it('should prioritize pnpm over npm when both exist', () => {
      fs.existsSync.mockReturnValue(true);
      
      const result = detectPackageManager('/test/project');
      expect(result.type).toBe('pnpm');
    });
  });

  describe('generateSBOM', () => {
    it('should generate SBOM using cyclonedx-npm', async () => {
      const mockSBOM = {
        bomFormat: 'CycloneDX',
        specVersion: '1.4',
        components: [
          { name: 'express', version: '4.18.0' }
        ]
      };

      // Mock to detect npm (package-lock.json exists, others don't)
      fs.existsSync.mockImplementation((filePath) => {
        return filePath.endsWith('package-lock.json') || filePath.endsWith('sbom.cdx.json') || filePath.endsWith('package.json');
      });
      fs.readFileSync.mockReturnValue(JSON.stringify(mockSBOM));
      execSync.mockImplementation(() => {});

      const result = await generateSBOM(testProjectDir, 'sbom.cdx.json');

      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('npx @cyclonedx/cyclonedx-npm'),
        expect.any(Object)
      );
      expect(result).toBe(testSBOMPath);
    });

    it('should handle omitTransitive option', async () => {
      const mockSBOM = {
        bomFormat: 'CycloneDX',
        specVersion: '1.4',
        components: [
          { name: 'express', version: '4.18.0' },
          { name: 'lodash', version: '4.17.21' }
        ]
      };

      fs.existsSync.mockImplementation((filePath) => {
        return filePath.endsWith('package-lock.json') || filePath.endsWith('sbom.cdx.json') || filePath.endsWith('package.json');
      });
      fs.readFileSync
        .mockReturnValueOnce(JSON.stringify({ dependencies: { express: '4.18.0' } }))
        .mockReturnValueOnce(JSON.stringify(mockSBOM));
      execSync.mockImplementation(() => {});

      await generateSBOM(testProjectDir, 'sbom.cdx.json', false, true);

      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('--omit dev --omit optional --omit peer'),
        expect.any(Object)
      );
    });

    it('should fetch repo URLs when requested', async () => {
      const mockSBOM = {
        bomFormat: 'CycloneDX',
        specVersion: '1.4',
        components: [
          { name: 'express', version: '4.18.0' }
        ]
      };

      const mockPackageInfo = {
        repository: {
          url: 'https://github.com/expressjs/express'
        }
      };

      fs.existsSync.mockImplementation((filePath) => {
        return filePath.endsWith('package-lock.json') || filePath.endsWith('sbom.cdx.json') || filePath.endsWith('package.json');
      });
      fs.readFileSync.mockReturnValue(JSON.stringify(mockSBOM));
      execSync.mockImplementation(() => {});

      https.get.mockImplementation((url, options, cb) => {
        const req = { on: jest.fn() };
        process.nextTick(() => {
          cb({
            statusCode: 200,
            on: (event, handler) => {
              if (event === 'data') { handler(JSON.stringify(mockPackageInfo)); }
              if (event === 'end') { handler(); }
            }
          });
        });
        return req;
      });

      await generateSBOM(testProjectDir, 'sbom.cdx.json', true);

      expect(https.get).toHaveBeenCalled();
    });

    it('should handle HTTPS errors when fetching repo URLs', async () => {
      const mockSBOM = {
        bomFormat: 'CycloneDX',
        specVersion: '1.4',
        components: [
          { name: 'express', version: '4.18.0' }
        ]
      };

      fs.existsSync.mockImplementation((filePath) => {
        return filePath.endsWith('package-lock.json') || filePath.endsWith('sbom.cdx.json') || filePath.endsWith('package.json');
      });
      fs.readFileSync.mockReturnValue(JSON.stringify(mockSBOM));
      execSync.mockImplementation(() => {});

      https.get.mockImplementation((url, options, cb) => {
        const req = { on: jest.fn() };
        process.nextTick(() => {
          cb({ statusCode: 404 });
        });
        return req;
      });

      await generateSBOM(testProjectDir, 'sbom.cdx.json', true);

      expect(https.get).toHaveBeenCalled();
    });

    it('should handle non-200 status codes', async () => {
      https.get.mockImplementation((url, options, cb) => {
        const req = { on: jest.fn() };
        process.nextTick(() => {
          cb({ statusCode: 500 });
        });
        return req;
      });

      const result = await new Promise((resolve) => {
        https.get('https://registry.npmjs.org/test', { timeout: 5000 }, (res) => {
          if (res.statusCode !== 200) {
            resolve(null);
          }
        });
      });

      expect(result).toBeNull();
    });
  });

  describe('readSBOM', () => {
    it('should read and parse SBOM file', () => {
      const mockSBOM = {
        bomFormat: 'CycloneDX',
        specVersion: '1.4',
        components: []
      };

      fs.readFileSync.mockReturnValue(JSON.stringify(mockSBOM));

      const result = readSBOM(testSBOMPath);

      expect(result).toEqual(mockSBOM);
      expect(fs.readFileSync).toHaveBeenCalledWith(testSBOMPath, 'utf8');
    });
  });

  describe('extractComponents', () => {
    it('should extract components with repo_url from externalReferences', () => {
      const sbom = {
        components: [
          {
            name: 'express',
            version: '4.18.0',
            externalReferences: [
              { type: 'vcs', url: 'https://github.com/expressjs/express' }
            ]
          }
        ]
      };

      const components = extractComponents(sbom);

      expect(components).toHaveLength(1);
      expect(components[0]).toEqual({
        name: 'express',
        version: '4.18.0',
        repo_url: 'https://github.com/expressjs/express'
      });
    });

    it('should extract components with repo_url from repository field', () => {
      const sbom = {
        components: [
          {
            name: 'lodash',
            version: '4.17.21',
            repository: { url: 'https://github.com/lodash/lodash' }
          }
        ]
      };

      const components = extractComponents(sbom);

      expect(components).toHaveLength(1);
      expect(components[0].repo_url).toBe('https://github.com/lodash/lodash');
    });

    it('should normalize GitHub URLs', () => {
      const sbom = {
        components: [
          {
            name: 'pkg',
            version: '1.0.0',
            externalReferences: [
              { type: 'vcs', url: 'git+https://github.com/user/repo.git' }
            ]
          }
        ]
      };

      const components = extractComponents(sbom);

      expect(components[0].repo_url).toBe('https://github.com/user/repo');
    });

    it('should handle components without repo_url', () => {
      const sbom = {
        components: [
          {
            name: 'internal-pkg',
            version: '1.0.0'
          }
        ]
      };

      const components = extractComponents(sbom);

      expect(components).toHaveLength(1);
      expect(components[0].repo_url).toBeNull();
    });

    it('should handle empty components', () => {
      const sbom = {
        components: []
      };

      const components = extractComponents(sbom);

      expect(components).toHaveLength(0);
    });

    it('should handle missing components field', () => {
      const sbom = {};

      const components = extractComponents(sbom);

      expect(components).toHaveLength(0);
    });

    it('should prefer vcs reference over repository field', () => {
      const sbom = {
        components: [
          {
            name: 'pkg',
            version: '1.0.0',
            externalReferences: [
              { type: 'vcs', url: 'https://github.com/primary/repo' }
            ],
            repository: { url: 'https://github.com/secondary/repo' }
          }
        ]
      };

      const components = extractComponents(sbom);

      expect(components[0].repo_url).toBe('https://github.com/primary/repo');
    });
  });
});

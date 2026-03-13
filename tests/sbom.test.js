const fs = require('fs');
const path = require('path');
const { generateSBOM, readSBOM, extractComponents, createSBOMFromPackageLock } = require('../src/lib/sbom');

describe('SBOM Module', () => {
  const testProjectPath = path.join(__dirname, 'fixtures', 'test-project');
  const testSBOMPath = path.join(__dirname, 'fixtures', 'test-sbom.json');
  const outputSBOMPath = path.join(testProjectPath, 'sbom.cdx.json');

  beforeEach(() => {
    if (fs.existsSync(outputSBOMPath)) {
      fs.unlinkSync(outputSBOMPath);
    }
  });

  afterEach(() => {
    if (fs.existsSync(outputSBOMPath)) {
      fs.unlinkSync(outputSBOMPath);
    }
  });

  describe('readSBOM', () => {
    it('should read and parse a valid SBOM file', () => {
      const sbom = readSBOM(testSBOMPath);

      expect(sbom).toBeDefined();
      expect(sbom.bomFormat).toBe('CycloneDX');
      expect(sbom.components).toBeDefined();
      expect(Array.isArray(sbom.components)).toBe(true);
    });

    it('should throw error for non-existent file', () => {
      expect(() => readSBOM('/non-existent/path/sbom.json')).toThrow();
    });

    it('should throw error for invalid JSON file', () => {
      const invalidPath = path.join(__dirname, 'fixtures', 'invalid.json');
      fs.writeFileSync(invalidPath, 'not valid json');

      expect(() => readSBOM(invalidPath)).toThrow();

      fs.unlinkSync(invalidPath);
    });
  });

  describe('extractComponents', () => {
    it('should extract components with name, version, and repo_url', () => {
      const sbom = readSBOM(testSBOMPath);
      const components = extractComponents(sbom);

      expect(components).toBeDefined();
      expect(Array.isArray(components)).toBe(true);

      if (components.length > 0) {
        const first = components[0];
        expect(first).toHaveProperty('name');
        expect(first).toHaveProperty('version');
        expect(first).toHaveProperty('repo_url');
      }
    });

    it('should return empty array for SBOM without components', () => {
      const emptySBOM = { bomFormat: 'CycloneDX', specVersion: '1.4' };
      const components = extractComponents(emptySBOM);

      expect(components).toEqual([]);
    });

    it('should handle components without external references', () => {
      const sbom = {
        bomFormat: 'CycloneDX',
        specVersion: '1.4',
        components: [
          { name: 'test-package', version: '1.0.0' }
        ]
      };

      const components = extractComponents(sbom);

      expect(components).toHaveLength(1);
      expect(components[0].name).toBe('test-package');
      expect(components[0].version).toBe('1.0.0');
      expect(components[0].repo_url).toBeNull();
    });

    it('should extract repo_url from vcs external reference', () => {
      const sbom = {
        bomFormat: 'CycloneDX',
        specVersion: '1.4',
        components: [
          {
            name: 'test-package',
            version: '1.0.0',
            externalReferences: [
              { type: 'vcs', url: 'https://github.com/test/repo' },
              { type: 'website', url: 'https://example.com' }
            ]
          }
        ]
      };

      const components = extractComponents(sbom);

      expect(components[0].repo_url).toBe('https://github.com/test/repo');
    });
  });

  describe('createSBOMFromPackageLock', () => {
    it('should create minimal SBOM from package-lock.json', async () => {
      const packageLock = {
        packages: {
          '': { name: 'root', version: '1.0.0' },
          'node_modules/express': { name: 'express', version: '4.18.0', resolved: 'https://registry.npmjs.org/express/-/express-4.18.0.tgz' },
          'node_modules/lodash': { name: 'lodash', version: '4.17.21' }
        }
      };

      const sbom = await createSBOMFromPackageLock(packageLock, false);

      expect(sbom.bomFormat).toBe('CycloneDX');
      expect(sbom.specVersion).toBe('1.4');
      expect(sbom.components).toHaveLength(2);
      expect(sbom.components.map(c => c.name)).toEqual(expect.arrayContaining(['express', 'lodash']));
    });
  });

  describe('generateSBOM', () => {
    it('should generate SBOM for a valid npm project', () => {
      if (!fs.existsSync(testProjectPath)) {
        console.log('Skipping generateSBOM test - test project not found');
        return;
      }

      if (!fs.existsSync(path.join(testProjectPath, 'node_modules'))) {
        console.log('Skipping generateSBOM test - node_modules not found');
        return;
      }

      const result = generateSBOM(testProjectPath, 'sbom.cdx.json');

      expect(result).toBeDefined();
      expect(fs.existsSync(result)).toBe(true);

      const sbom = readSBOM(result);
      expect(sbom.bomFormat).toBe('CycloneDX');
    }, 60000);
  });
});

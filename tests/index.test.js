const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let horseboxAvailable = false;
try {
  execSync('hb --help', { stdio: 'ignore' });
  horseboxAvailable = true;
} catch {
  // Horsebox not available
}

const { analyze } = require('../src/index');

describe('Main Module', () => {
  const testProjectPath = path.join(__dirname, 'fixtures', 'test-project');

  describe('analyze', () => {
    it('should throw error for non-existent project path', async () => {
      await expect(async () => {
        await analyze('/non-existent/path');
      }).rejects.toThrow('Project path does not exist');
    });

    it('should analyze project and generate markdown files', () => {
      if (!horseboxAvailable) {
        console.log('Skipping test - Horsebox not installed');
        return;
      }

      if (!fs.existsSync(testProjectPath)) {
        console.log('Skipping test - test-project not found');
        return;
      }

      return analyze(testProjectPath, {
        sbomPath: 'test-sbom.json',
      }).then(result => {
        expect(result).toBeDefined();
        expect(result.sbomPath).toBeDefined();
        expect(result.generated).toBeDefined();
        expect(Array.isArray(result.generated)).toBe(true);
      });
    }, 120000);
  });
});

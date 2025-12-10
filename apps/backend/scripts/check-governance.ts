import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const MAX_LINES = 400;

interface Violation {
  file: string;
  rule: string;
  message: string;
}

const violations: Violation[] = [];

function checkFile(filePath: string) {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // 1. File Naming (kebab-case)
  if (!/^[a-z0-9\-\.]+$/.test(fileName)) {
    violations.push({
      file: filePath,
      rule: 'Naming Conventions',
      message: `Filename must be kebab-case: ${fileName}`,
    });
  }

  // 2. File Size Limit (Architecture)
  if (lines.length > MAX_LINES) {
    violations.push({
      file: filePath,
      rule: 'Architecture - Complexity',
      message: `File exceeds ${MAX_LINES} lines (${lines.length}). Refactor suggested.`,
    });
  }

  // 3. Interface Naming (No 'I' prefix)
  if (filePath.endsWith('.interface.ts')) {
    const interfaceMatch = content.match(/interface\s+(I[A-Z][a-zA-Z0-9]*)/);
    if (interfaceMatch) {
      violations.push({
        file: filePath,
        rule: 'Naming Conventions',
        message: `Interface ${interfaceMatch[1]} should not have 'I' prefix.`,
      });
    }
  }

  // 4. Class Naming matches Filename
  // e.g., users.service.ts -> class UsersService
  if (fileName.endsWith('.ts')) {
    const namePart = fileName.replace('.ts', '');
    const expectedClassName = namePart
      .split(/[\-\.]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    // Check if it's a class file (likely)
    if (content.includes('export class')) {
        if (!content.includes(`class ${expectedClassName}`)) {
             // Check strict specific suffixes
             if (fileName.endsWith('.service.ts') && !content.includes(`class ${expectedClassName}`)) {
                 violations.push({ file: filePath, rule: 'Naming', message: `Expected class ${expectedClassName} in ${fileName}`});
             }
             if (fileName.endsWith('.controller.ts') && !content.includes(`class ${expectedClassName}`)) {
                 violations.push({ file: filePath, rule: 'Naming', message: `Expected class ${expectedClassName} in ${fileName}`});
             }
             if (fileName.endsWith('.module.ts') && !content.includes(`class ${expectedClassName}`)) {
                 violations.push({ file: filePath, rule: 'Naming', message: `Expected class ${expectedClassName} in ${fileName}`});
             }
        }
    }
  }
}

function checkDirectory(dirPath: string) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      checkDirectory(fullPath);
    } else {
      checkFile(fullPath);
    }
  });
}

function checkArchitectureRules() {
    // 5. Testing Strategy
    const globAllFiles = (dir: string): string[] => {
        let results: string[] = [];
        const entry = fs.readdirSync(dir);
        entry.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                results = results.concat(globAllFiles(fullPath));
            } else {
                results.push(fullPath);
            }
        });
        return results;
    }

    const allFiles = globAllFiles(SRC_DIR);
    
    allFiles.forEach(file => {
        if (file.endsWith('.service.ts') || file.endsWith('.controller.ts')) {
            const specFile = file.replace('.ts', '.spec.ts');
            if (!fs.existsSync(specFile)) {
                violations.push({
                    file: file,
                    rule: 'Architecture - Testing',
                    message: `Missing unit test (${path.basename(specFile)}) for ${path.basename(file)}`
                });
            }
        }
    });

    // 6. Feature Module Structure
    allFiles.forEach(file => {
        if (file.includes('common') && file.endsWith('.controller.ts')) {
             violations.push({
                file: file,
                rule: 'Architecture - SRP',
                message: `Controllers should not reside in common directory. They belong in feature modules.`
            });
        }
    });
}

// MAIN
console.log('🔍 Running Governance Checks...');
if (fs.existsSync(SRC_DIR)) {
  checkDirectory(SRC_DIR);
  checkArchitectureRules();
} else {
  console.error('❌ src directory not found!');
  process.exit(1);
}

if (violations.length > 0) {
  console.error(`\n❌ Found ${violations.length} governance violations:\n`);
  violations.forEach((v) => {
    console.error(`[${v.rule}] in ${path.relative(process.cwd(), v.file)}`);
    console.error(`   ${v.message}`);
  });
  console.error('\nPlease fix these issues before committing.');
  process.exit(1);
} else {
  console.log('✅ All governance checks passed.');
  process.exit(0);
}

const fs = require('fs');
const path = require('path');

const compDir = path.resolve(__dirname, '../frontend/src/components');
const outDir = path.resolve(__dirname, '../frontend/src/__tests__/components');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  let files = [];
  list.forEach(file => {
    const p = path.resolve(dir, file);
    const stat = fs.statSync(p);
    if (stat && stat.isDirectory()) {
      files = files.concat(walk(p));
    } else if (file.endsWith('.tsx')) {
      files.push(p);
    }
  });
  return files;
}

const components = walk(compDir);

components.forEach(file => {
  const relPath = path.relative(compDir, file);
  const name = path.basename(file, '.tsx');
  const testPath = path.resolve(outDir, relPath.replace(/\.tsx$/, '.test.tsx'));
  const dir = path.dirname(testPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const importPath = '@/components/' + relPath.replace(/\\/g, '/').replace(/\.tsx$/, '');
  const testContent = `import { render } from '@testing-library/react';
import ${name} from '${importPath}';

describe('Component: ${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
  });
});
`;
  fs.writeFileSync(testPath, testContent, 'utf8');
  console.log('Created component test for', name, '->', testPath);
});

console.log('Generated', components.length, 'component tests');

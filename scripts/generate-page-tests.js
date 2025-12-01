const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../frontend/src/pages');
const outDir = path.resolve(__dirname, '../frontend/src/__tests__/pages');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
files.forEach(file => {
  const name = path.basename(file, '.tsx');
  const testFile = path.resolve(outDir, `${name}.test.tsx`);
  const content = `import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ${name} from '@/pages/${name}';

describe('${name} page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><${name} /></MemoryRouter>);
  });
});
`;
  fs.writeFileSync(testFile, content, 'utf8');
  console.log('Created test for', name);
});

console.log('Generated', files.length, 'page tests');

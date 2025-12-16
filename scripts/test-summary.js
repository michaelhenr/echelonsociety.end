#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🧪 Running all tests...\n');

let frontendTests = { passed: 0, skipped: 0, total: 0 };
let backendTests = { passed: 0, total: 0 };

try {
  // Run frontend tests
  console.log('📱 Running Frontend Tests (Vitest)...\n');
  const frontendOutput = execSync('npx vitest --run', { 
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log(frontendOutput);
  
  // Parse frontend results
  const frontendMatch = frontendOutput.match(/Tests\s+(\d+)\s+passed\s+\|\s+(\d+)\s+skipped\s+\((\d+)\)/);
  if (frontendMatch) {
    frontendTests.passed = parseInt(frontendMatch[1]);
    frontendTests.skipped = parseInt(frontendMatch[2]);
    frontendTests.total = parseInt(frontendMatch[3]);
  }
  
  console.log('\n🔧 Running Backend Tests (Jest)...\n');
  
  // Run backend tests - capture both stdout and stderr
  const backendOutput = execSync('cd backend && npm test 2>&1', { 
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log(backendOutput);
  
  // Parse backend results - look for the final summary line
  const backendLines = backendOutput.split('\n');
  for (const line of backendLines) {
    // Match "Tests:       27 passed, 27 total" (with variable whitespace)
    let match = line.match(/Tests:\s+(\d+)\s+passed(?:,\s+(\d+)\s+total)?/);
    if (match) {
      backendTests.passed = parseInt(match[1]);
      backendTests.total = parseInt(match[2] || match[1]);
      break;
    }
  }
  
  // Debug: if still 0, log the last lines
  if (backendTests.total === 0) {
    console.log('\n⚠️  Could not parse backend test count. Last 15 lines:');
    console.log(backendOutput.split('\n').slice(-15).join('\n'));
  }
  
  // Show summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Frontend: ${frontendTests.passed} passed, ${frontendTests.skipped} skipped (${frontendTests.total} total)`);
  console.log(`Backend:  ${backendTests.passed} passed (${backendTests.total} total)`);
  console.log('-'.repeat(60));
  const totalPassed = frontendTests.passed + backendTests.passed;
  const totalSkipped = frontendTests.skipped;
  const grandTotal = frontendTests.total + backendTests.total;
  console.log(`TOTAL:    ${totalPassed} passed, ${totalSkipped} skipped (${grandTotal} total)`);
  console.log('='.repeat(60));
  
  if (totalPassed === grandTotal - totalSkipped) {
    console.log('✅ All tests passing!\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error running tests:', error.message);
  process.exit(1);
}


// Quick verification that VALID_FIELD_TYPES matches FieldRegistry
const fs = require('fs');
const path = require('path');

// Read types.ts
const typesPath = path.join(__dirname, 'src/domain/types.ts');
const typesContent = fs.readFileSync(typesPath, 'utf-8');

// Extract VALID_FIELD_TYPES
const validTypesMatch = typesContent.match(/VALID_FIELD_TYPES = \[([\s\S]*?)\] as const/);
const validTypes = validTypesMatch[1]
  .split(',')
  .map(s => s.trim().replace(/'/g, ''))
  .filter(Boolean)
  .sort();

// Read FieldRegistry.ts
const registryPath = path.join(__dirname, 'src/domain/FieldRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf-8');

// Extract registered fields
const registerMatches = registryContent.matchAll(/registry\.register\('(\w+)',/g);
const registeredTypes = Array.from(registerMatches, m => m[1]).sort();

console.log('VALID_FIELD_TYPES:', validTypes);
console.log('Registered types:', registeredTypes);
console.log('\nMatch:', JSON.stringify(validTypes) === JSON.stringify(registeredTypes) ? '✓' : '✗');

if (JSON.stringify(validTypes) !== JSON.stringify(registeredTypes)) {
  console.log('\nMissing in VALID_FIELD_TYPES:', registeredTypes.filter(t => !validTypes.includes(t)));
  console.log('Extra in VALID_FIELD_TYPES:', validTypes.filter(t => !registeredTypes.includes(t)));
  process.exit(1);
}

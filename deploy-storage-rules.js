// Deploy Firebase Storage Rules
// Run this script to deploy storage rules to Firebase

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Deploying Firebase Storage Rules...\n');

try {
  // Check if Firebase CLI is installed
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is installed');
  } catch (error) {
    console.error('❌ Firebase CLI is not installed. Please install it first:');
    console.error('npm install -g firebase-tools');
    process.exit(1);
  }

  // Check if user is logged in
  try {
    execSync('firebase projects:list', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is authenticated');
  } catch (error) {
    console.error('❌ Please login to Firebase first:');
    console.error('firebase login');
    process.exit(1);
  }

  // Check if storage.rules file exists
  const rulesPath = path.join(__dirname, 'storage.rules');
  if (!fs.existsSync(rulesPath)) {
    console.error('❌ storage.rules file not found');
    process.exit(1);
  }

  console.log('✅ storage.rules file found');

  // Deploy storage rules
  console.log('\n📤 Deploying storage rules...');
  execSync('firebase deploy --only storage', { stdio: 'inherit' });

  console.log('\n🎉 Storage rules deployed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Test the rules in Firebase Console → Storage → Rules');
  console.log('2. Verify file uploads work in your application');
  console.log('3. Check that unauthorized access is blocked');

} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}

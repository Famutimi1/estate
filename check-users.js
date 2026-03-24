// Check existing users in database
require('dotenv').config();

// Simple database check without Prisma client complexity
async function checkUsers() {
  console.log('👥 Checking Existing Users in Database\n');
  
  // This would require running the actual server
  // For now, let's provide guidance
  
  console.log('💡 To check existing users:');
  console.log('');
  console.log('1. Start your development server:');
  console.log('   npm run dev');
  console.log('');
  console.log('2. Open your database admin tool (pgAdmin, DBeaver, etc.)');
  console.log('');
  console.log('3. Run this SQL query:');
  console.log('   SELECT email, name, created_at FROM users ORDER BY created_at DESC;');
  console.log('');
  console.log('4. Or check your app\'s registration page to see what emails are registered');
  console.log('');
  console.log('🔍 The forgot password only works for emails that exist in the users table!');
  console.log('');
  console.log('📧 Test with an email that you know is registered in your database.');
}

checkUsers();

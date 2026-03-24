// Debug Forgot Password Email Issue
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function debugForgotPasswordIssue() {
  console.log('🔍 Debugging Forgot Password Email Issue...\n');
  
  const testEmail = 'famutimi95@gmail.com';
  
  try {
    // 1. Check database connection
    console.log('1️⃣  Checking database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');
    
    // 2. Check if user exists
    console.log('2️⃣  Checking if user exists:', testEmail);
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
      select: {
        id: true,
        email: true,
        name: true,
        resetToken: true,
        resetTokenExpiry: true,
      }
    });
    
    if (!user) {
      console.log('❌ USER NOT FOUND in database!');
      console.log('This is the main issue - the email', testEmail, 'does not exist in the users table.');
      console.log('Without a user record, no email will be sent (security protection).');
      
      // Check what users do exist
      console.log('\n📋 Checking existing users in database...');
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
        take: 5
      });
      
      if (allUsers.length === 0) {
        console.log('❌ No users found in database at all!');
        console.log('You need to register a user first before testing forgot password.');
      } else {
        console.log('✅ Found existing users:');
        allUsers.forEach(u => {
          console.log(`   - ${u.email} (${u.name || 'No name'}) - Created: ${u.createdAt}`);
        });
      }
      
      return;
    }
    
    console.log('✅ User found:');
    console.log('   - ID:', user.id);
    console.log('   - Email:', user.email);
    console.log('   - Name:', user.name || 'No name');
    console.log('   - Reset Token:', user.resetToken || 'None');
    console.log('   - Token Expiry:', user.resetTokenExpiry || 'None');
    
    // 3. Check environment variables for email
    console.log('\n3️⃣  Checking email configuration...');
    console.log('   - RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('   - RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ Missing');
    console.log('   - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ Missing');
    
    if (!process.env.RESEND_API_KEY) {
      console.log('\n❌ RESEND_API_KEY is missing!');
      console.log('Add this to your .env file:');
      console.log('RESEND_API_KEY="re_your_actual_resend_api_key"');
    }
    
    if (!process.env.RESEND_FROM_EMAIL) {
      console.log('\n❌ RESEND_FROM_EMAIL is missing!');
      console.log('Add this to your .env file:');
      console.log('RESEND_FROM_EMAIL="onboarding@resend.dev"');
    }
    
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.log('\n❌ NEXT_PUBLIC_APP_URL is missing!');
      console.log('Add this to your .env file:');
      console.log('NEXT_PUBLIC_APP_URL="http://localhost:3000"');
    }
    
    // 4. Test actual email sending if user exists
    if (user && process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      console.log('\n4️⃣  Testing actual email sending...');
      
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
      
      console.log('   - To:', user.email);
      console.log('   - From:', process.env.RESEND_FROM_EMAIL);
      console.log('   - Reset URL:', resetUrl);
      
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: [user.email],
          subject: 'Test Password Reset - myHOME',
          html: `
            <h1>Test Password Reset</h1>
            <p>Hello ${user.name || 'there'},</p>
            <p>This is a test password reset email.</p>
            <p><a href="${resetUrl}">Reset Password</a></p>
            <p>Or copy this link: ${resetUrl}</p>
          `,
        });
        
        if (error) {
          console.log('❌ Email sending failed:', error);
          console.log('Error details:', JSON.stringify(error, null, 2));
        } else {
          console.log('✅ Email sent successfully!');
          console.log('Response:', data);
          console.log('\n📧 Check your inbox for the test email!');
        }
      } catch (emailError) {
        console.log('❌ Email sending error:', emailError.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Debug error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugForgotPasswordIssue();

// Test Complete Forgot Password API Flow
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const { Resend } = require('resend');

// Load environment variables
require('dotenv').config();

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPasswordResetEmail(email, resetToken, userName) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - myHOME</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 40px 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
        .button:hover {
          background: #1e40af;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 14px;
        }
        .security-note {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>myHOME</h1>
        <p>Password Reset Request</p>
      </div>
      
      <div class="content">
        <h2>Hello ${userName || 'there'},</h2>
        
        <p>We received a request to reset your password for your myHOME account. Click the button below to reset your password:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">
          ${resetUrl}
        </p>
        
        <div class="security-note">
          <strong>Security Notice:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>This link will expire in 1 hour for security reasons</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>Never share this link with anyone</li>
          </ul>
        </div>
        
        <p>If you have any questions or didn't request this reset, please contact our support team.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} myHOME. All rights reserved.</p>
          <p>Nigeria's Premier Real Estate Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [email],
    subject: 'Reset Your myHOME Password',
    html,
  });
}

async function testCompleteForgotPasswordFlow() {
  console.log('Testing Complete Forgot Password API Flow...');
  
  const testEmail = 'famutimi95@gmail.com';
  
  try {
    console.log('\n1️⃣  Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    console.log('\n2️⃣  Finding user by email:', testEmail);
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    
    if (!user) {
      console.log('❌ User not found in database');
      console.log('This is why you\'re not receiving emails!');
      console.log('The user with email', testEmail, 'does not exist in the database.');
      return;
    }
    
    console.log('✅ User found:', user.name || 'No name', user.email);
    
    console.log('\n3️⃣  Generating reset token...');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    console.log('Reset Token:', resetToken);
    console.log('Expires at:', resetTokenExpiry);
    
    console.log('\n4️⃣  Saving reset token to database...');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });
    console.log('✅ Reset token saved to database');
    
    console.log('\n5️⃣  Sending password reset email...');
    try {
      const { data, error } = await sendPasswordResetEmail(user.email, resetToken, user.name);
      
      if (error) {
        console.log('❌ Email sending failed:', error);
        console.log('Error details:', JSON.stringify(error, null, 2));
      } else {
        console.log('✅ Password reset email sent successfully!');
        console.log('Response:', data);
      }
    } catch (emailError) {
      console.log('❌ Email sending error:', emailError.message);
    }
    
    console.log('\n6️⃣  Verification - checking saved token...');
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        resetToken: true,
        resetTokenExpiry: true,
      }
    });
    
    console.log('✅ Updated user data:');
    console.log('- Email:', updatedUser.email);
    console.log('- Reset Token:', updatedUser.resetToken ? '✅ Saved' : '❌ Missing');
    console.log('- Reset Token Expiry:', updatedUser.resetTokenExpiry);
    
  } catch (error) {
    console.log('❌ Error in forgot password flow:', error.message);
    console.log('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteForgotPasswordFlow();

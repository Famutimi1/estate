// Test Forgot Password Flow
const { Resend } = require('resend');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Simulate the forgot password email function
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

async function testForgotPasswordFlow() {
  console.log('Testing Forgot Password Flow...');
  console.log('Environment Variables:');
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('- RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ Missing');
  console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || '❌ Missing');
  
  // Simulate the forgot password process
  const testEmail = 'famutimi95@gmail.com';
  const resetToken = crypto.randomBytes(32).toString('hex');
  const userName = 'Test User';
  
  console.log('\n📧 Sending forgot password email...');
  console.log('To:', testEmail);
  console.log('Reset Token:', resetToken);
  console.log('Reset URL:', `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`);
  
  try {
    const { data, error } = await sendPasswordResetEmail(testEmail, resetToken, userName);
    
    if (error) {
      console.log('❌ Forgot password email failed:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Forgot password email sent successfully!');
      console.log('Response:', data);
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testForgotPasswordFlow();

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL || 'noreply@myhome.ng',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string, userName?: string) {
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

  return sendEmail({
    to: email,
    subject: 'Reset Your myHOME Password',
    html,
  });
}

export async function sendWelcomeEmail(email: string, userName: string, userRole?: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to myHOME - ${userName}!</title>
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
        .welcome-icon {
          width: 80px;
          height: 80px;
          background: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .feature-list {
          background: #e0f2fe;
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 20px 0;
          border-radius: 6px;
        }
        .feature-list h3 {
          color: #1e40af;
          margin-top: 0;
        }
        .feature-list ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .feature-list li {
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>myHOME</h1>
        <p>Welcome to Nigeria's Premier Real Estate Platform!</p>
      </div>
      
      <div class="content">
        <div class="welcome-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>
        
        <h2>Welcome, ${userName}!</h2>
        
        <p>Thank you for joining myHOME! We're excited to have you as part of our real estate community. Your account has been successfully created${userRole === 'agent' ? ' as a Property Agent' : userRole === 'admin' ? ' as an Administrator' : ''}.</p>
        
        <div class="feature-list">
          <h3>🏠 What You Can Do Now:</h3>
          <ul>
            <li><strong>Browse Properties:</strong> Explore our extensive collection of properties for sale and rent</li>
            <li><strong>Save Favorites:</strong> Keep track of properties you love with our favorites feature</li>
            <li><strong>Advanced Search:</strong> Use filters to find exactly what you're looking for</li>
            ${userRole === 'agent' ? '<li><strong>List Properties:</strong> Add and manage your property listings</li><li><strong>Get Leads:</strong> Receive inquiries from interested buyers and renters</li>' : ''}
            ${userRole === 'admin' ? '<li><strong>Manage Platform:</strong> Access admin dashboard and settings</li><li><strong>Monitor Activity:</strong> Oversee user activity and property listings</li>' : ''}
          </ul>
        </div>
        
        <p>Your account is now ready to use! Click the button below to log in and start exploring:</p>
        
        <div style="text-align: center;">
          <a href="${loginUrl}" class="button">Log In to Your Account</a>
        </div>
        
        <p><strong>Login Details:</strong></p>
        <ul style="background: #f3f4f6; padding: 15px; border-radius: 6px; list-style: none;">
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Account Type:</strong> ${userRole === 'agent' ? 'Property Agent' : userRole === 'admin' ? 'Administrator' : 'Regular User'}</li>
        </ul>
        
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <strong>🔐 Security Tips:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Keep your password secure and don't share it with anyone</li>
            <li>We'll never ask for your password via email</li>
            <li>Always check that you're on the official myHOME website</li>
          </ul>
        </div>
        
        <p>If you have any questions or need help getting started, our support team is here to help!</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} myHOME. All rights reserved.</p>
          <p>Nigeria's Premier Real Estate Platform</p>
          <p>📧 Email: support@myhome.ng | 📞 Phone: +234 803 123 4567</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to myHOME - Your Account is Ready!`,
    html,
  });
}

export async function sendAdminNotificationEmail(
  type: 'registration' | 'contact' | 'schedule',
  data: any,
  adminEmail?: string
) {
  const recipientEmail = adminEmail || process.env.ADMIN_EMAIL || 'admin@myhome.ng';
  
  let subject, html;
  
  switch (type) {
    case 'registration':
      subject = `🎉 New User Registration: ${data.name}`;
      html = generateRegistrationNotificationHTML(data);
      break;
      
    case 'contact':
      subject = `📧 New Contact Message: ${data.subject || 'No Subject'}`;
      html = generateContactNotificationHTML(data);
      break;
      
    case 'schedule':
      subject = `📅 New Viewing Scheduled: ${data.propertyTitle || 'Property Viewing'}`;
      html = generateScheduleNotificationHTML(data);
      break;
      
    default:
      throw new Error('Invalid notification type');
  }

  return sendEmail({
    to: recipientEmail,
    subject,
    html,
  });
}

function generateRegistrationNotificationHTML(data: {
  name: string;
  email: string;
  role: string;
  phone?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New User Registration - myHOME Admin</title>
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
          background: linear-gradient(135deg, #10b981, #059669);
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
        .info-grid {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 15px;
          margin: 20px 0;
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
        }
        .info-label {
          font-weight: bold;
          color: #1f2937;
        }
        .info-value {
          color: #4b5563;
        }
        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          color: white;
          background: ${data.role === 'admin' ? '#dc2626' : data.role === 'agent' ? '#2563eb' : '#10b981'};
        }
        .action-buttons {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }
        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          color: white;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .btn-primary {
          background: #2563eb;
        }
        .btn-primary:hover {
          background: #1e40af;
        }
        .btn-secondary {
          background: #6b7280;
        }
        .btn-secondary:hover {
          background: #4b5563;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 New User Registration</h1>
        <p>A new user has joined myHOME</p>
      </div>
      
      <div class="content">
        <h2>User Registration Details</h2>
        
        <div class="info-grid">
          <div class="info-label">Name:</div>
          <div class="info-value">${data.name}</div>
          
          <div class="info-label">Email:</div>
          <div class="info-value">
            <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a>
          </div>
          
          <div class="info-label">Phone:</div>
          <div class="info-value">
            ${data.phone ? `<a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a>` : 'Not provided'}
          </div>
          
          <div class="info-label">Account Type:</div>
          <div class="info-value">
            <span class="role-badge">${data.role.toUpperCase()}</span>
          </div>
          
          <div class="info-label">Registration:</div>
          <div class="info-value">${new Date().toLocaleString()}</div>
        </div>
        
        <div class="action-buttons">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users" class="btn btn-primary">View User</a>
          <a href="mailto:${data.email}" class="btn btn-secondary">Contact User</a>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <strong>📋 Next Steps:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Review user profile and information</li>
            <li>${data.role === 'agent' ? 'Verify agent credentials and documentation' : 'Send welcome message if needed'}</li>
            <li>Monitor user activity and engagement</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} myHOME. All rights reserved.</p>
          <p>Admin Notification System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateContactNotificationHTML(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message - myHOME Admin</title>
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
        .info-grid {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 15px;
          margin: 20px 0;
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
        }
        .info-label {
          font-weight: bold;
          color: #1f2937;
        }
        .info-value {
          color: #4b5563;
        }
        .message-box {
          background: #e0f2fe;
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 20px 0;
          border-radius: 6px;
        }
        .action-buttons {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }
        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          color: white;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .btn-primary {
          background: #2563eb;
        }
        .btn-primary:hover {
          background: #1e40af;
        }
        .btn-secondary {
          background: #6b7280;
        }
        .btn-secondary:hover {
          background: #4b5563;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📧 New Contact Message</h1>
        <p>Someone has contacted myHOME</p>
      </div>
      
      <div class="content">
        <h2>Contact Message Details</h2>
        
        <div class="info-grid">
          <div class="info-label">Name:</div>
          <div class="info-value">${data.name}</div>
          
          <div class="info-label">Email:</div>
          <div class="info-value">
            <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a>
          </div>
          
          <div class="info-label">Phone:</div>
          <div class="info-value">
            ${data.phone ? `<a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a>` : 'Not provided'}
          </div>
          
          <div class="info-label">Subject:</div>
          <div class="info-value">${data.subject || 'No Subject'}</div>
          
          <div class="info-label">Received:</div>
          <div class="info-value">${new Date().toLocaleString()}</div>
        </div>
        
        <div class="message-box">
          <h3>💬 Message:</h3>
          <p style="margin: 15px 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <div class="action-buttons">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contacts" class="btn btn-primary">View All Contacts</a>
          <a href="mailto:${data.email}" class="btn btn-secondary">Reply to Sender</a>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <strong>📋 Next Steps:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Review the message content and respond promptly</li>
            <li>Check if this is a sales inquiry, support request, or general question</li>
            <li>Update contact status in admin dashboard after responding</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} myHOME. All rights reserved.</p>
          <p>Admin Notification System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateScheduleNotificationHTML(data: {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  viewerType: string;
  message?: string;
  propertyTitle?: string;
  propertyId?: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Viewing Scheduled - myHOME Admin</title>
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
          background: linear-gradient(135deg, #f59e0b, #d97706);
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
        .info-grid {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 15px;
          margin: 20px 0;
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
        }
        .info-label {
          font-weight: bold;
          color: #1f2937;
        }
        .info-value {
          color: #4b5563;
        }
        .viewer-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          color: white;
          background: ${data.viewerType === 'buyer' ? '#10b981' : data.viewerType === 'renter' ? '#2563eb' : '#f59e0b'};
        }
        .message-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin: 20px 0;
          border-radius: 6px;
        }
        .action-buttons {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }
        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          color: white;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .btn-primary {
          background: #2563eb;
        }
        .btn-primary:hover {
          background: #1e40af;
        }
        .btn-secondary {
          background: #6b7280;
        }
        .btn-secondary:hover {
          background: #4b5563;
        }
        .btn-success {
          background: #10b981;
        }
        .btn-success:hover {
          background: #059669;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📅 New Viewing Scheduled</h1>
        <p>Property viewing appointment requested</p>
      </div>
      
      <div class="content">
        <h2>Viewing Schedule Details</h2>
        
        <div class="info-grid">
          <div class="info-label">Applicant:</div>
          <div class="info-value">${data.name}</div>
          
          <div class="info-label">Email:</div>
          <div class="info-value">
            <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a>
          </div>
          
          <div class="info-label">Phone:</div>
          <div class="info-value">
            <a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a>
          </div>
          
          <div class="info-label">Viewer Type:</div>
          <div class="info-value">
            <span class="viewer-badge">${data.viewerType.toUpperCase()}</span>
          </div>
          
          <div class="info-label">Property:</div>
          <div class="info-value">
            ${data.propertyTitle ? `
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/properties/${data.propertyId}" style="color: #2563eb;">
                ${data.propertyTitle}
              </a>
            ` : 'General Inquiry'}
          </div>
          
          <div class="info-label">Date:</div>
          <div class="info-value">${data.preferredDate}</div>
          
          <div class="info-label">Time:</div>
          <div class="info-value">${data.preferredTime}</div>
          
          <div class="info-label">Requested:</div>
          <div class="info-value">${new Date().toLocaleString()}</div>
        </div>
        
        ${data.message ? `
          <div class="message-box">
            <h3>💬 Additional Message:</h3>
            <p style="margin: 15px 0; white-space: pre-wrap;">${data.message}</p>
          </div>
        ` : ''}
        
        <div class="action-buttons">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/schedules" class="btn btn-primary">View Schedule</a>
          ${data.propertyId ? `<a href="${process.env.NEXT_PUBLIC_APP_URL}/properties/${data.propertyId}" class="btn btn-secondary">View Property</a>` : ''}
          <a href="mailto:${data.email}" class="btn btn-success">Contact Applicant</a>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <strong>📋 Next Steps:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Confirm the viewing appointment with the applicant</li>
            <li>Check property availability for the requested date/time</li>
            <li>Prepare property for viewing and arrange for agent to be present</li>
            <li>Update schedule status in admin dashboard</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} myHOME. All rights reserved.</p>
          <p>Admin Notification System</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendPasswordResetSuccessEmail(email: string, userName?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Success - myHOME</title>
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
          background: linear-gradient(135deg, #10b981, #059669);
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
        .success-icon {
          width: 60px;
          height: 60px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>myHOME</h1>
        <p>Password Reset Successful</p>
      </div>
      
      <div class="content">
        <div class="success-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        
        <h2>Password Successfully Reset!</h2>
        
        <p>Hi ${userName || 'there'},</p>
        
        <p>Your myHOME password has been successfully reset. You can now log in to your account with your new password.</p>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login" class="button">Log In to Your Account</a>
        </div>
        
        <p>If you didn't reset your password or have any security concerns, please contact our support team immediately.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} myHOME. All rights reserved.</p>
          <p>Nigeria's Premier Real Estate Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Your myHOME Password Has Been Reset',
    html,
  });
}

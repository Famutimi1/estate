import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/services/auth';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increased limit for avatar uploads
    },
  },
};

function uploadAvatarToCloudinary(buffer: Buffer, mimetype: string, originalName: string) {
  // Generate unique public_id for avatar
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const publicId = `estate/avatars/avatar_${timestamp}`;

  const options: { folder: string; resource_type: 'image'; public_id: string } = {
    folder: 'estate/avatars',
    resource_type: 'image',
    public_id: publicId,
  };

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error || new Error('Cloudinary upload failed'));
        return;
      }

      resolve({ url: result.secure_url, publicId: result.public_id });
    });

    stream.end(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Avatar upload request received');
    
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = verifyToken(token);
    if (!userId) {
      console.log('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    console.log('User authenticated:', userId);

    // Get the file from form data - same pattern as working upload
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      console.log('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed' 
      }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('File too large:', file.size);
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 });
    }

    console.log('File validation passed, uploading to Cloudinary...');

    // Convert file to buffer and upload to Cloudinary - same pattern as working upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadAvatarToCloudinary(buffer, file.type, file.name);

    console.log('Cloudinary upload successful:', uploadResult);

    // Update user's avatar URL in database
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: uploadResult.url },
    });

    console.log('Database updated successfully');

    return NextResponse.json({ 
      success: true, 
      avatarUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      message: 'Profile picture uploaded successfully' 
    });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({ 
      error: 'Failed to upload profile picture: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

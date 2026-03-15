import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

function uploadBufferToCloudinary(buffer: Buffer, mimetype: string, originalName: string) {
  // Determine resource type based on file mime type
  let resourceType: 'image' | 'video' | 'raw' = 'image';
  if (mimetype.startsWith('video/')) {
    resourceType = 'video';
  } else if (
    mimetype === 'application/pdf' ||
    mimetype === 'application/msword' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype.startsWith('application/')
  ) {
    resourceType = 'raw';
  }

  // Generate unique public_id - keep extension for raw files
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const publicId = `estate/properties/${sanitizedName}_${timestamp}`;

  const options: { folder: string; resource_type: 'image' | 'video' | 'raw'; public_id: string; format?: string } = {
    folder: 'estate/properties',
    resource_type: resourceType,
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
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadBufferToCloudinary(buffer, file.type, file.name);

    return NextResponse.json({ url: uploadResult.url, publicId: uploadResult.publicId });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

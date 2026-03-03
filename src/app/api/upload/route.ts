import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

function uploadBufferToCloudinary(buffer: Buffer, folder = 'estate/properties') {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
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
    const uploadResult = await uploadBufferToCloudinary(buffer);

    return NextResponse.json({ url: uploadResult.url, publicId: uploadResult.publicId });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

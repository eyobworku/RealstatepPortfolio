'use server'
import { readDatabase, writeDatabase } from '@/lib/dbOperations';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import streamifier from 'streamifier'

export async function uploadToCloudinary(file: File, folder = 'properties') {
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    console.log('file type:', file.type);
    if (!file.type) throw new Error('Invalid file type');

    const fileBase64 = `data:${file.type};base64,${fileBuffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder,
      resource_type: file.type.startsWith('video') ? 'video' : 'image', // Optional: force type
    });

    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload to Cloudinary');
  }
}

export async function uploadStreamToCloudinary(fileBuffer: Buffer, options = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}


export async function addProperty({title,shortDescription,detailDescription,coverImageData,additionalImagesData,videoData}:any)  {
  try {    
    // Create property object
    const newProperty = {
      id: Date.now().toString(),
      title,
      shortDescription,
      detailDescription,
      coverImage: coverImageData,
      additionalImages: additionalImagesData,
      video: videoData,
      createdAt: new Date().toISOString(),
    };    
    // Read existing database
    const properties = await readDatabase('property.json');
    properties.push(newProperty);
    await writeDatabase(properties,'property.json');
    revalidatePath('/ermiadmin');
    
    return { success: true, message: 'Property added!'  };
  } catch (error: any) {
    console.error('Error adding property:', error);
    return { success: false, message: 'Property not added!'  };
  }
}

export async function readProperties() {
  const properties = await readDatabase('property.json');
  return properties;
}

export async function deleteProperty(id: string) {
  const properties = await readDatabase('property.json');
  const updatedProperties = properties.filter((property) => property.id !== id);
  await writeDatabase(updatedProperties, 'property.json');
}
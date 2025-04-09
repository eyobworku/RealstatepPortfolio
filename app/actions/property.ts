'use server'
import { readDatabase, writeDatabase } from '@/lib/dbOperations';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import streamifier from 'streamifier'
import { put } from '@vercel/blob';


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

export async function uploadStreamToCloudinary(video: File): Promise<any> {
  try {
    const {url} = await put(video.name, video, { access: 'public' });
    console.log('url',url);    
    return url
  } catch (error) {
    console.log('bolb upload error',error);
    return ''
  }
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
    const properties = await readDatabase('properties');
    properties.push(newProperty);
    await writeDatabase(properties,'properties');
    revalidatePath('/ermiadmin');
    
    return { success: true, message: 'Property added!'  };
  } catch (error: any) {
    console.error('Error adding property:', error);
    return { success: false, message: 'Property not added!'  };
  }
}

export async function readProperties() {
  const properties = await readDatabase('properties');
  return properties;
}

export async function deleteProperty(id: string) {
  const properties = await readDatabase('properties');
  const updatedProperties = properties.filter((property) => property.id !== id);
  await writeDatabase(updatedProperties, 'properties');
}
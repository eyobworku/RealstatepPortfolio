import { readProperties, addProperty } from "@/app/actions/property";
import { NextResponse } from "next/server";
import {
  uploadToCloudinary,
  uploadStreamToCloudinary,
} from "@/app/actions/property";
export async function GET() {
  const properties = await readProperties();
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
  const coverImage = formData.get("coverImage") as File | null;
  const additionalImages = Array.from(
    formData.getAll("additionalImages")
  ) as File[];
  const video = formData.get("video") as File | null;
  const title = formData.get("title") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const detailDescription = formData.get("detailDescription") as string;

  // Upload cover image
  let coverImageData: string = "";
  if (coverImage && coverImage.size > 0) {
    coverImageData = await uploadToCloudinary(coverImage, "properties/cover");
  }

  // Upload additional images (up to 3)
  const additionalImagesData = [] as string[];
  for (const image of additionalImages) {
    if (image && image.size > 0) {
      const imageData = await uploadToCloudinary(
        image,
        "properties/additional"
      );
      additionalImagesData.push(imageData);
    }
    // Only upload up to 3 images
    if (additionalImagesData.length >= 3) break;
  }

  // Upload video
  let videoData: string = "";
  if (video && video.size > 0) {
    const videoUploadResult = await uploadStreamToCloudinary(video);
    videoData = videoUploadResult;
  }
  const result = await addProperty({title,shortDescription,detailDescription,coverImageData,additionalImagesData,videoData})
  return NextResponse.json(result)
  } catch (error) {
    console.log('POST Error', error);
    return NextResponse.json(
      {success:false, message: 'Failed to delete property' },
      { status: 500 }
    );    
  }
}

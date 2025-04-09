import { StaticImageData } from "next/image";
interface Post {
  id: string;
  title: string;
  shortDescription: string;
  detailDescription?: string;
  coverImage: string | StaticImageData;
  additionalImages: (string | StaticImageData)[];
  video?: string;
}

export type { Post };
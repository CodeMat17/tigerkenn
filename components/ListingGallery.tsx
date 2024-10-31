// components/ImageGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

type ImageGalleryProps = {
  mainImage: string;
  thumbnails: string[];
  title: string;
};

const ListingGallery = ({
  mainImage,
  thumbnails,
  title,
}: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(mainImage);

  return (
    <div>
      {/* Main Image */}
      <Image
        priority
        width={700}
        height={394}
        src={selectedImage}
        alt={title}
        className='rounded-lg mb-3 w-full h-96 aspect-video object-cover'
      />

      {/* Thumbnails */}
      <div className="flex justify-center">
        <div className='flex gap-2 overflow-x-auto mb-6 px-2 sm:px-0 scroll-snap-x snap-mandatory hide-scrollbar'>
          {thumbnails.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(imgUrl)}
              className='flex-shrink-0 w-24 h-24'>
              <Image
                src={imgUrl}
                alt={`Thumbnail ${index + 1}`}
                width={96}
                height={96}
                className={`rounded-lg object-cover border-2 ${
                  selectedImage === imgUrl
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingGallery;

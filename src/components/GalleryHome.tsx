import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const GalleryHome = () => {
  const allImages: GalleryImage[] = Array.from({ length: 33 }, (_, i) => ({
    id: i + 1,
    src: `/gallery/${i + 1}.jpeg`,
    alt: "Hostel interior"
  }));

  const [visibleImages, setVisibleImages] = useState<number>(10);
  const imagesPerLoad = 10;

  const handleLoadMore = () => {
    setVisibleImages(prev => Math.min(prev + imagesPerLoad, allImages.length));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center items-center gap-8 p-2 relative">
        {allImages.slice(0, visibleImages).map((image) => (
          <div
            key={image.id}
            className="rounded-xl overflow-hidden sm:w-[250px] sm:h-[200px] w-[175px] h-[150px] relative"
          >
            <Image
              src={image.src}
              alt={image.alt}
              className="rounded-xl"
              objectFit="cover"
              layout="fill"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {visibleImages < allImages.length && (
        <Button
          onClick={handleLoadMore}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors transform hover:scale-105"
          size="lg"
        >
          Load More
        </Button>
      )}
    </div>
  );
}

export default GalleryHome
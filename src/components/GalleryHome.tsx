import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getAllImages } from '@/actions/admin/gallery';
import { GalleryImage } from '@/lib/types';
import { CldImage } from 'next-cloudinary';


const GalleryHome = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])

  const [visibleImages, setVisibleImages] = useState<number>(10);
  const imagesPerLoad = 10;

  const handleLoadMore = () => {
    setVisibleImages(prev => Math.min(prev + imagesPerLoad, galleryImages.length));
  };

  useEffect(() => {
    (async () => {
      const { error, images } = await getAllImages();
      if (error) return;
      if (images) {
        setGalleryImages(images)
      }
    })()
  }, [])


  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center items-center gap-8 p-2 relative">
        {galleryImages.slice(0, visibleImages).map((image) => (
          <div
            key={image.id}
            className="rounded-xl overflow-hidden sm:w-[250px] sm:h-[200px] w-[175px] h-[150px] relative"
          >
            <CldImage
              src={image.publicUrl}
              alt={`Gallery Image ${image.id}`}
              className="rounded-xl"
              objectFit="cover"
              layout="fill"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {visibleImages < galleryImages.length && (
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
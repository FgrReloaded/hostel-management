import { createNewImage, deleteImage, getAllImages } from "@/actions/admin/gallery"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, RefreshCcw } from 'lucide-react'
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { useEffect, useState } from "react"
import { GalleryImage } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function GalleryManager() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // @ts-expect-error-ignore
  const handleSuccess = async (result) => {
    const { error, msg, newImage } = await createNewImage(result.info.public_id, result.info.secure_url);
    if (error) {
      console.error(msg);
      return;
    }
    if (newImage) {
      setGalleryImages([...galleryImages, newImage])
    }
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { error, images } = await getAllImages();
      setIsLoading(false);
      if (error) return;
      if (images) {
        setGalleryImages(images)
      }
    })()
  }, [])

  const removeImage = async (imageId: bigint) => {
    const { error, msg } = await deleteImage(imageId);
    if (error) {
      console.error(msg);
      return;
    }
    setGalleryImages(galleryImages.filter((image) => image.id !== imageId))
  }

  const refresh = async () => {
    setIsLoading(true);
    const { error, images } = await getAllImages();
    setIsLoading(false);
    if (error) return;
    if (images) {
      setGalleryImages(images)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 items-center mb-4">
        <h1 className="text-2xl font-bold">Gallery Manager</h1>
        <span className="bg-gray-50 rounded-lg p-2 w-fit hover:bg-gray-100 cursor-pointer" onClick={refresh}>
          <RefreshCcw className="h-4 w-4" />
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Image</h2>
        <div className="flex gap-2">
          <CldUploadWidget onSuccess={handleSuccess} uploadPreset="hostel">
            {({ open }) => {
              return (
                <Button onClick={() => { open() }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Image
                </Button>
              )
            }}
          </CldUploadWidget>
        </div>
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4
       gap-4 bg-white p-4 rounded-xl">
        {isLoading && (<>
          <Skeleton className="w-72 h-72 rounded-xl" />
          <Skeleton className="rounded-xl w-72 h-72" />
        </>
        )}
        {
          galleryImages.length === 0 && !isLoading && (
            <div className="text-lg font-semibold text-gray-500">No images found</div>
          )
        }
        {galleryImages.map((image) => (
          <div key={image.id} className="relative group hover:scale-100">
            <CldImage src={image.publicUrl} width={300} height={300} alt="Gallery Image" className="rounded-lg" />
            <Button
              onClick={() => { removeImage(image.id) }}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove image ${image.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
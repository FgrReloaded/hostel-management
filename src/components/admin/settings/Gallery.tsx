import { createNewImage, deleteImage, getAllImages } from "@/actions/admin/gallery"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from 'lucide-react'
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { useEffect, useState } from "react"
import { GalleryImage } from "@/lib/types"

export default function GalleryManager() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])

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
      const { error, images } = await getAllImages();
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


  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4">Gallery Manager</h1>

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
        {
          galleryImages.length === 0 && (
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
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const DeleteHeroImage = ({ id, img }: { id: string; img: string }) => {
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDeleteImage = async (imgUrl: string) => {
    setDeleting(true);
    try {
      // Step 1: Delete image from Cloudinary
      const resCloudinary = await fetch("/api/delete-cloudinary-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imgUrl, // The image URL to be deleted
        }),
      });

      if (!resCloudinary.ok) {
        const error = await resCloudinary.json();
        console.error("Error deleting Cloudinary image:", error.message);
        alert("Failed to delete the image from Cloudinary.");
        setDeleting(false);
        return;
      }

      toast("Deleting!!!");

      // Step 2: Update Supabase record to remove the image URL from 'heroContent'
      const resSupabase = await fetch("/api/delete-supabase-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id, // The ID of the hero record in Supabase
          imgUrl, // The image URL to be deleted from the 'heroContent' array
        }),
      });

      if (!resSupabase.ok) {
        const error = await resSupabase.json();
        console.error("Error updating Supabase record:", error.message);
        alert("Failed to update the record in Supabase.");
        setDeleting(false);
        return;
      }

      // Image successfully deleted
      toast("DONE!", { description: "Image deleted successfully." });
    } catch (error) {
      console.error("Error during image deletion process:", error);
      alert("An error occurred while deleting the image.");
    } finally {
      setOpen(false);
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='absolute right-0 bottom-0 bg-red-500 text-white p-1 rounded-lg cursor-pointer'>
        <TrashIcon className='w-5 h-5' />
      </DialogTrigger>
      <DialogContent className='max-w-sm mx-auto'>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this carousel image?
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <Image
            alt=''
            priority
            width={400}
            height={250}
            src={img}
            className='w-full aspect-video rounded-xl'
          />
          <Button
            onClick={() => handleDeleteImage(img)}
            disabled={deleting}
            className={deleting ? "cursor-not-allowed" : ""}>
            {deleting ? "Deleting..." : "Yes, delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteHeroImage;

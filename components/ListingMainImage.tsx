"use client";

import {   MinusIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Props = {
  id: string;
  image: string | null; // Single image URL from Supabase
};

const ListingMainImage = ({ id, image }: Props) => {
  const selectRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  // Handle file selection
  const handleButtonClick = () => {
    if (selectRef.current) {
      selectRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // Submit new or replacement image
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id", id);

    // Validate selection
    if (!selectedFile) {
      toast.error("No image selected");
      return;
    }

    formData.append("file", selectedFile);

    // If replacing an image, include the current image URL for removal
    if (image) {
      formData.append("currentUrl", image);
    }

    setUpdating(true);

    try {
      // API call to upload or replace the image
      const res = await fetch("/api/upload-listing-main-image", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Image updated successfully",
        });
      } else {
        toast.error(`Update Failed!`, {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Error uploading image`);
    } finally {
      setUpdating(false);
      setSelectedFile(null); // Reset selected file after upload
    }
  };

  return (
    <div className='mt-1 flex flex-col md:flex-row items-center justify-between gap-4 bg-sky-50 dark:bg-gray-900 rounded-xl p-7'>
      <div className='md:w-[70%] flex items-center justify-center md:justify-start'>
        {image ? (
          <Image
            alt='Image Preview'
            width={250}
            height={150}
            src={image}
            className='mt-1 w-[300px] sm:w-[250px] aspect-video rounded-xl object-cover cursor-pointer'
            onClick={handleButtonClick} // Tap to select image for replacement
          />
        ) : (
          <p>No image attached yet</p>
        )}
      </div>
      <div className='md:w-[30%] flex flex-col justify-center items-center gap-3'>
        <input
          type='file'
          hidden
          ref={selectRef}
          accept='image/*'
          onChange={handleFileChange}
        />
        <div className='flex flex-col justify-center'>
          <Button onClick={handleButtonClick} className='w-full'>
        
            {image ? "Replace Image" : "Attach Image"}
          </Button>
          {selectedFile && (
            <span className='text-xs text-center'>
              {selectedFile.name} selected
            </span>
          )}
        </div>

        <div className='flex flex-col justify-center'>
          <Button
            onClick={handleSubmit}
            disabled={updating || !selectedFile}
            className={`w-full`}>
            {updating
              ? <MinusIcon className="animate-spin"/>
              : image
              ? "Submit Replacement"
              : "Upload Image"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingMainImage;

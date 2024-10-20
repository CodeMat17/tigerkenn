"use client";

import {   MinusIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Props = {
  id: string;
  images: string[]; // Image URLs array from Supabase
};

const MAX_FILES = 4;

const ListingOtherImages = ({ id, images }: Props) => {
  const selectRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [updating, setUpdating] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  ); // Track which image is selected for replacement

  // Handle file selection
  const handleButtonClick = () => {
    if (selectRef.current) {
      selectRef.current.click();
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > MAX_FILES) {
      alert(`You can only select up to ${MAX_FILES} images.`);
      setSelectedFiles(null);
    } else {
      setSelectedFiles(files);
    }
  };

  // Image tap for replacement
  const handleImageTap = (index: number) => {
    setSelectedImageIndex(index);
    handleButtonClick();
  };

  // Submit new or replacement images
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("id", id);

    // Validate selection
    if (!selectedFiles) {
      toast.error("No images selected");
      return;
    }

    // Add selected files to form data
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    setUpdating(true);

    try {
      // Replace selected image if one is tapped
      if (selectedImageIndex !== null) {
        formData.append("replaceIndex", selectedImageIndex.toString());
        formData.append("currentUrl", images[selectedImageIndex]);
      }

      // API call to upload or replace images
      const res = await fetch("/api/upload-listing-other-images", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast("DONE!", {
          description: "Images updated successfully",
        });
      } else {
        toast.error(`Update Failed!`, {
          description: `${result.error} || Something went wrong`,
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error(`Error uploading images`);
    } finally {
      setUpdating(false);
      setSelectedImageIndex(null); // Reset after update
      setSelectedFiles(null); // Reset selected files
    }
  };

  return (
    <div className='mt-1 flex flex-col md:flex-row items-center justify-between gap-4 bg-sky-50 dark:bg-gray-900 rounded-xl p-7'>
      <div className='flex flex-wrap gap-3 md:w-[70%] items-center justify-center md:justify-start'>
        {images && images.length > 0 ? (
          images.map((file, i) => (
            <Image
              key={i}
              alt={`Other Image Preview ${i}`}
              width={150}
              height={80}
              src={file}
              className='mt-1 w-[200px] sm:w-[150px] aspect-video rounded-xl object-cover cursor-pointer'
              onClick={() => handleImageTap(i)} // Tap to select image for replacement
            />
          ))
        ) : (
          <p>No descriptive image attached yet</p>
        )}
      </div>
      <div className='md:w-[30%] flex flex-col justify-center items-center gap-3'>
        <input
          type='file'
          hidden
          ref={selectRef}
          accept='image/*'
          multiple
          onChange={handleFilesChange}
        />
        <div className='flex flex-col justify-center'>
          <Button onClick={handleButtonClick} className='w-full'>
           Attach Images
          </Button>
          {selectedFiles && (
            <span className='text-xs text-center'>
              {selectedFiles.length} file(s) selected
            </span>
          )}
        </div>

        <div className='flex flex-col justify-center'>
          <Button
            onClick={handleSubmit}
            disabled={updating || !selectedFiles}
            className={`w-full `}>
            {updating
              ? <MinusIcon className="animate-spin"/>
              : selectedImageIndex !== null
              ? "Replace Image"
              : "Update Images"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingOtherImages;

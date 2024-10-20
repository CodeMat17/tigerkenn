"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import the CSS for React Quill

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MinusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner"; // For notifications

const AddNewList = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [other_imgs, setOtherImgs] = useState<FileList | null>(null);
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqm, setSqm] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const [uploading, setUploading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "img" | "other_imgs"
  ) => {
    if (field === "img") {
      const file = e.target.files?.[0] || null;
      setImg(file);
    } else {
      const files = e.target.files

      // Validate for a maximum of 4 files for other_imgs
      if (files && files.length > 4) {
        toast.error("You can only upload a maximum of 4 images.");
        setOtherImgs(null);
      } else {
        setOtherImgs(files);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !title ||
      !location ||
      !img ||
      !sqm ||
      !desc ||
      !price ||
      !category ||
      !status
    ) {
      toast.error("Please fill all the required fields.");
      return;
    }

    setUploading(true);

    try {
      // Prepare FormData
      const formData = new FormData();

      formData.append("title", title);
      formData.append("location", location);
      formData.append("beds", beds);
      formData.append("baths", baths);
      formData.append("sqm", String(sqm));
      formData.append("price", String(price));
      formData.append("status", status);
      formData.append("desc", desc);
      formData.append("category", category);

      // Append the main image
      if (img) {
        formData.append("img", img);
      }

      // Append other images
     if (other_imgs) {
       for (let i = 0; i < other_imgs.length; i++) {
         formData.append("files", other_imgs[i]);
       }
     }

      // Send the form data to the backend API
      const response = await fetch("/api/add-new-listing", {
        method: "POST",
        body: formData, // Send the form data
      });

      if (response.ok) {
        toast("DONE!", {
          description: "Listing added successfully",
        });

        setTitle("");
        setLocation("");
        setImg(null);
        setOtherImgs(null);
        setBeds("");
        setBaths("");
        setSqm(undefined);
        setPrice(undefined);
        setDesc("");
        setStatus("");
        setCategory("");
        router.push("/admin/listings");
      } else {
        toast.error("ERROR!", {
          description: "Failed to add listing",
        });
      }
    } catch (error) {
      toast.error("ERROR!", {
        description: `An error occurred: ${error}`,
      });
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className='max-w-4xl min-h-screen mx-auto pb-12 pt-6'>
      <h1 className='text-3xl text-center font-semibold mb-6'>
        Add New Listing
      </h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='flex flex-col gap-4'>
          <div>
            <label className='text-sm text-gray-400'>Title</label>
            <Input
              placeholder='Title'
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className='mt-1'
            />
          </div>
          <div className='flex gap-4 w-full'>
            <div className='w-full'>
              <label className='text-sm text-gray-400'>Location</label>
              <Input
                placeholder='Eg. Emene, Enugu'
                name='location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className='mt-1 w-full'
              />
            </div>

            <div className='w-full'>
              <label className='text-sm text-gray-400'>Price</label>
              <Input
                placeholder='Eg. 70000000'
                name='price'
                type='number'
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className='mt-1 w-full'
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='w-full'>
              <label className='text-sm text-gray-400'>Beds</label>
              <Input
                placeholder='Beds'
                name='beds'
                type='text'
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className='mt-1'
              />
            </div>
            <div className='w-full'>
              <label className='text-sm text-gray-400'>Baths</label>
              <Input
                placeholder='Baths'
                name='baths'
                type='text'
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className='mt-1'
              />
            </div>
            <div className='w-full'>
              <label className='text-sm text-gray-400'>Sqm</label>
              <Input
                placeholder='Sq. Meters'
                name='sqm'
                type='number'
                value={sqm || ""}
                onChange={(e) => setSqm(Number(e.target.value))}
                required
                className='mt-1'
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='w-full'>
              <label className='text-sm mb-1 text-gray-400'>Category</label>
              <Select
                name='category'
                value={category}
                onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='house'>House</SelectItem>
                  <SelectItem value='land'>Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='w-full'>
              <label className='text-sm mb-1 text-gray-400'>Status</label>
              <Select name='status' value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='For sale'>For sale</SelectItem>
                  <SelectItem value='For rent'>For rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className='text-sm text-gray-400'>Description</label>
            <ReactQuill
              value={desc}
              onChange={setDesc}
              theme='snow'
              className='mt-1 rounded-lg overflow-hidden border'
            />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Main Image</label>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => handleFileChange(e, "img")}
            className='file-input'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Other Images</label>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={(e) => handleFileChange(e, "other_imgs")}
            className='file-input'
          />

          {/* Display uploaded images */}
          <div className='mt-2 flex flex-wrap gap-2'>
            {other_imgs &&
              Array.from(other_imgs).map((file, index) => (
                <div key={index} className='relative'>
                  <Image
                    width={24}
                    height={24}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className='w-24 h-24 object-cover'
                  />
                  <button
                    type='button'
                    className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full'
                    onClick={() => {
                      setOtherImgs((prevImgs) => {
                        if (!prevImgs) return null; // If no images, return null

                        const dt = new DataTransfer(); // Create new DataTransfer object

                        Array.from(prevImgs)
                          .filter((_, i) => i !== index) // Filter out the file you want to remove
                          .forEach((file) => dt.items.add(file)); // Add remaining files to DataTransfer

                        return dt.files.length > 0 ? dt.files : null; // Return updated FileList or null
                      });
                    }}>
                    <MinusIcon className='w-4 h-4' />
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div>
          <Button type='submit' disabled={uploading} className='w-full'>
            {uploading ? <MinusIcon className='animate-spin' /> : "Add Listing"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewList;

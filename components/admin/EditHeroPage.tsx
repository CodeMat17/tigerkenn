"use client";

import { ImageUpIcon, MinusIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import DeleteHeroImage from "./DeleteHeroImage";

type HeroProps = {
  id: string;
  heroTitle: string;
  heroDesc: string;
  heroContent: string[];
};

export default function EditHeroPage({
  id,
  heroTitle,
  heroDesc,
  heroContent,
}: HeroProps) {
  // Create a ref for the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
   const [title, setTitle] = useState(heroTitle);
   const [desc, setDesc] = useState(heroDesc);
  //  const [images, setImages] = useState(heroContent)
   const [uploading, setUploading] = useState(false);
   const [message, setMessage] = useState("");

   const MAX_FILES = 10;

  // Function to trigger the file input click
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > MAX_FILES) {
      alert(`You can only select up to ${MAX_FILES} images.`);
      setSelectedFiles(null); // Reset the file selection
      return;
    }

    setSelectedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    if (!title || !desc) {
      alert("Please fill out all fields and select files");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("desc", desc);

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("file", selectedFiles[i]);
      }
    }

    try {
      const res = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(`Upload successful!`);
      } else {
        setMessage(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setMessage("Error uploading images.");
    } finally {
      setMessage("");
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 mt-2 max-w-2xl mx-auto'>
      <Input
        type='text'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='border-gray-400'
      />

      <Textarea
        placeholder='Description'
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className='border-gray-400'
      />

      <div className='flex flex-wrap gap-4 justify-center py-4'>
        {heroContent &&
          heroContent.map((img, i) => (
            <div key={i} className='relative'>
              <Image
                alt=''
                width={120}
                height={40}
                src={img}
                className='rounded-lg w-[120px] aspect-video'
              />
              <DeleteHeroImage id={id} img={img} />
            </div>
          ))}
      </div>

      <Input
        type='file'
        ref={fileInputRef}
        hidden
        multiple
        onChange={handleFileChange}
        className=' border border-gray-400 cursor-pointer focus:outline-none hidden'
        accept='image/*'
      />

      <div className='flex flex-col justify-center items-center gap-12'>
        <div className='flex flex-col items-center bg-gray-200 dark:bg-gray-900 rounded-xl p-6 '>
          <div
            onClick={handleButtonClick}
            className='border flex justify-center bg-sky-600 rounded-xl overflow-hidden p-4 hover:bg-sky-700 hover:text-gray-300 cursor-pointer transition-all duration-500 ease-in-out mb-1'>
            <ImageUpIcon className='mr-3' /> Choose Files
          </div>
          <p>
            {selectedFiles && (
              <span>{selectedFiles.length} files selected</span>
            )}
          </p>
        </div>

        <Button type='submit' className='' disabled={uploading}>
          {uploading ? <MinusIcon className='animate-spin' /> : "Upload Data"}
        </Button>

        {message && <p>{message}</p>}
      </div>
    </form>
  );
}

"use client";

import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface Project {
  id: number;
  title: string;
  desc: string;
  imgUrl: string;
}

interface CompletedProjectsProps {
  projects: Project[];
}

const CompletedProjects: React.FC<CompletedProjectsProps> = ({ projects }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (imgUrl: string) => {
    setSelectedImage(imgUrl);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className='max-w-6xl mx-auto py-8'>
      {/* Section Title */}
      <div className='text-center mb-8'>
        <h1 className='text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white'>
          Completed Projects
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>Selected few</p>
      </div>

      {/* Scrollable Project Cards */}
      <div className='relative'>
        {/* Smoky Edges */}
        <div className='absolute inset-y-0 left-0 w-8 sm:w-32 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-950 pointer-events-none'></div>
        <div className='absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-950 pointer-events-none'></div>

        <div
          ref={scrollRef}
          className='flex gap-6 overflow-x-auto hide-scrollbar p-6 bg-white dark:bg-gray-950 rounded-lg'>
          {projects.map((project) => (
            <div
              key={project.id}
              className='flex flex-col sm:flex-row items-center bg-gradient-to-r from-blue-300 to-blue-500 dark:from-blue-700 dark:to-blue-900 text-white rounded-lg p-4 shadow-lg min-w-[300px] sm:w-[400px] transition-transform hover:scale-105 cursor-pointer'
              onClick={() => handleCardClick(project.imgUrl)}>
              {/* Text Content */}
              <div className='flex-1 sm:mr-4'>
                <h3 className='text-lg font-bold mb-2 line-clamp-3 leading-5'>
                  {project.title}
                </h3>
                <p className='text-sm line-clamp-6 leading-5'>{project.desc}</p>
              </div>

              {/* Image */}
              <div className='flex-1 sm:ml-4'>
                <Image
                  src={project.imgUrl}
                  alt={project.title}
                  width={300}
                  height={200}
                  className='w-full h-52 object-cover rounded-lg'
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev and Next Buttons */}
      <div className='flex justify-center gap-8 mt-4'>
        <button
          onClick={scrollLeft}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-transform transform hover:scale-105 active:scale-95'>
          <ChevronsLeftIcon />
        </button>
        <button
          onClick={scrollRight}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-transform transform hover:scale-105 active:scale-95'>
          <ChevronsRightIcon />
        </button>
      </div>

      {/* Modal for Image View */}
      {selectedImage && (
        <div
          className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'
          onClick={() => setSelectedImage(null)}>
          <div
            className='relative'
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
          >
            <Image
              src={selectedImage}
              alt='Selected'
              width={800}
              height={600}
              className='max-w-full max-h-screen rounded-lg'
            />
            <button
              onClick={() => setSelectedImage(null)}
              className='absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 hover:bg-red-600'>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedProjects;

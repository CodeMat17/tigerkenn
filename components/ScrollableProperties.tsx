"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion"; // Optional, for smooth animation
import Image from "next/image";
import { Bath, Bed, Ruler } from "lucide-react";

type PropertiesProps = {
  beds: string;
  baths: string;
  price: number;
  sqm: number;
  other_imgs: []
};

const ScrollableProperties = ({
  price,
  beds,
  baths,
  sqm,
  other_imgs,
}: PropertiesProps) => {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const currentRefs = imageRefs.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Intersection logic (if needed)
          }
        });
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: "0px",
        threshold: 0.7, // Trigger when 70% of the image is in view
      }
    );

    currentRefs.forEach((image) => {
      if (image) observer.observe(image);
    });

    return () => {
      currentRefs.forEach((image) => {
        if (image) observer.unobserve(image);
      });
    };
  }, []);

  return (
    <div className='relative w-full bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mt-8'>
      {/* Scroll hint text */}
      {other_imgs && (
        <div className='text-center text-sm mt-2 text-gray-500 dark:text-gray-400'>
          Scroll to view more property angles
        </div>
      )}

      {/* Horizontal scroll container with background */}

      {other_imgs ? (
        <div className='relative w-full overflow-x-auto hide-scrollbar px-4 pb-4 pt-2'>
          <div className='flex space-x-4 px-2'>
            {other_imgs.map((image, index) => (
              <motion.div
                key={index}
                className='shrink-0 w-[350px] flex justify-center items-center rounded-xl overflow-hidden'
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                data-index={index}>
                <Image
                  src={image}
                  width={300}
                  height={200}
                  alt={`Image ${index + 1}`}
                  className='w-[350px] object-cover aspect-video rounded-xl shadow-md'
                />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Property Details */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between px-6 pb-6 ${
          other_imgs ? "" : "pt-6"
        } shadow`}>
        <div className='text-3xl font-bold text-blue-600'>₦{price}</div>

        <div className='flex items-center space-x-6 mt-3 md:mt-0'>
          {/* Beds */}
          {beds && (
            <div className='flex flex-col md:flex-row justify-center items-center md:gap-2'>
              <Bed className='w-6 h-6 text-blue-500' />
              <p className='text-sm text-center'>{beds} beds</p>
            </div>
          )}

          {/* Baths */}
          {baths && (
            <div className='flex flex-col md:flex-row justify-center items-center md:gap-2'>
              <Bath className='w-6 h-6 text-blue-500' />
              <p className='text-sm text-center'>{baths} baths</p>
            </div>
          )}

          {/* Square Feet */}
          {sqm && (
            <div className='flex flex-col md:flex-row justify-center items-center md:gap-2'>
              <Ruler className='w-6 h-6 text-blue-500' />
              <p className='text-sm text-center'>{sqm} sqm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollableProperties;

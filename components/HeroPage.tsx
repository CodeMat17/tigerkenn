// /app/page.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  { src: "/hero/hero1.webp", alt: "Image 1" },
  { src: "/hero/hero2.webp", alt: "Image 2" },
  { src: "/hero/hero3.webp", alt: "Image 3" },
  { src: "/hero/hero4.webp", alt: "Image 4" },
  { src: "/hero/hero5.webp", alt: "Image 5" },
  { src: "/hero/hero6.webp", alt: "Image 6" },
  { src: "/hero/hero7.webp", alt: "Image 7" },
];

type HeroProps = {
  title: string;
  desc: string;
  content: [];
};

const HeroPage = ({ title, desc, content }: HeroProps) => {
  const [index, setIndex] = useState(0);

  // Auto-rotate the images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className='relative w-full h-[calc(100vh-10rem)] sm:h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-900 overflow-hidden'>
      <AnimatePresence>
        {content &&
          content.map(
            (image, i) =>
              i === index && (
                <motion.div
                  key={image}
                  className='absolute inset-0 z-0'
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ duration: 1 }}>
                  <Image
                    priority
                    src={image}
                    alt={image}
                    fill
                    className='w-full h-full object-cover'
                  />
                  {/* Dark Overlay */}
                  <div className='absolute inset-0 bg-black bg-opacity-50 z-10'></div>
                </motion.div>
              )
          )}
      </AnimatePresence>

      <div className='absolute z-20 text-center text-white max-w-2xl'>
        <motion.h1
          className='text-5xl font-bold'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          {title}
        </motion.h1>
        <motion.p
          className='mt-4 text-lg'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}>
          {desc}
        </motion.p>
        <motion.div>
          <Link
            href='/listings'
            className='mt-8 inline-block px-6 py-3 border border-white text-white font-semibold rounded-full shadow-lg hover:bg-white hover:text-black'>
            Explore Listings
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroPage;

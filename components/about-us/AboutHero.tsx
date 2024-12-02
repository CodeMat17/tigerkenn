

'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import StatsSection from "@/components/StatsSection";

const AboutHero = () => {
  const images = [
    "/hero/hero1.webp",
    "/hero/hero2.webp",
    "/hero/hero3.webp",
    "/hero/hero4.webp",
    "/hero/hero5.webp",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className='relative h-[60vh] overflow-hidden'>
      {/* Image Container */}
      <div className='absolute inset-0'>
        <AnimatePresence>
          {images.map(
            (image, index) =>
              index === currentImageIndex && (
                <motion.div
                  key={image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className='absolute inset-0'>
                  <Image
                    src={image}
                    alt='Tigerkenn Homes Office'
                    fill
                    className='object-cover'
                    priority
                  />
                  <div className='absolute inset-0 bg-black/50' />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className='relative flex flex-col h-full justify-center md:flex-row md:items-center px-4 sm:pl-8 gap-4'>
        <div className='max-w-2xl text-white'>
          <h1 className='mb-4 text-4xl font-bold sm:text-5xl md:text-6xl'>
            Building Dreams, Creating Homes
          </h1>
          <p className='text-lg text-gray-200'>
            At Tigerkenn Homes, we believe that every home tells a story.
            We are dedicated to providing comprehensive solutions for all your housing and construction needs.
          </p>
        </div>
        <StatsSection />
      </div>
    </section>
  );
};

export default AboutHero;

"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

type Props = {
  projects: { id: number; desc: string; imgUrl: string; }[];
}

export function FeaturedProperties({projects}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getVisibleProperties = () => {
    const visibleCount = 3; // Number of items to display
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % projects.length;
      items.push({ ...projects[index], position: i });
    }
    return items;
  };

  return (
    <section className='py-16 bg-muted/30 overflow-hidden bg-gray-100 dark:bg-gray-950'>
      <div className=''>
        <div className='mb-8 flex flex-col items-center justify-center'>
          <h2 className='text-center text-3xl font-bold'>Completed Projects</h2>
          <Badge>Selected</Badge>
        </div>

        <div className='relative flex justify-center items-center h-[400px] md:h-[500px] w-full '>
          <AnimatePresence>
            {getVisibleProperties().map((property) => {
              const isCenter = property.position === 1;
              return (
                <motion.div
                  key={property.id}
                  initial={{
                    x: "100%",
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    x: `${(property.position - 1) * 100}%`,
                    opacity: isCenter ? 1 : 0.5,
                    scale: isCenter ? 1 : 0.8,
                  }}
                  exit={{
                    x: "-100%",
                    opacity: 0,
                    scale: 0.8,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                  className={`absolute w-64 md:w-72 -translate-x-1/2 rounded-xl overflow-hidden ${
                    isCenter ? "z-10" : "z-0"
                  }`}>
                  <Card className='overflow-hidden transform-gpu'>
                    <CardHeader className='p-0'>
                      <div className='relative aspect-square overflow-hidden'>
                        <Image
                          src={property.imgUrl}
                          alt={property.imgUrl}
                          fill
                          className='object-cover transition-transform duration-300'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          priority
                        />
                      </div>
                    </CardHeader>
                    <CardContent className='p-4 text-center bg-blue-600 '>
                      <p className='mb-2 text-sm text-white'>
                        {property.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

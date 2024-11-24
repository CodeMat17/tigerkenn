"use client";

import React, { useEffect, useState } from "react"; // Import React here
import { createClient } from "@/utils/supabase/clients";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { ChevronsLeftIcon, ChevronsRightIcon, QuoteIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0][0].toUpperCase();
  } else {
    return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
  }
};

interface ReviewCardProps {
  img: string;
  name: string;
  position: string;
  body: string;
}

const ReviewCard = ({ name, position, body }: ReviewCardProps) => {
  const stars = Array(5).fill(0);
  const initials = getInitials(name);

  return (
    <div className='flex flex-col min-w-[320px] max-w-xs p-4 mx-2 bg-white rounded-lg shadow-lg dark:shadow-md hover:shadow-xl transition transform duration-500 ease-in-out hover:scale-105 dark:bg-gray-800 border dark:border-none'>
      <div className='flex justify-between'>
        <div className='mb-3 mr-1 flex'>
          {stars.map((_, i) => (
            <StarFilledIcon key={i} className='text-amber-500' />
          ))}
        </div>
        <QuoteIcon />
      </div>

      <p className='text-gray-700 dark:text-gray-300 mb-3'>{body}</p>
      <hr className='dark:border-gray-700' />

      <div className='flex items-center gap-2 mt-2'>
        <Avatar>
          <AvatarFallback className='bg-sky-500 text-white font-semibold text-lg'>
            {initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            {name}
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{position}</p>
        </div>
      </div>
    </div>
  );
};

export default function ReviewCarousel() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<ReviewCardProps[]>([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const { data: reviews, error } = await supabase
          .from("reviews")
          .select("*");

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        setReviews(reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    getReviews();
  }, [supabase]);

  // State to manage the scroll position
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollContainerRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrollable(
          scrollContainerRef.current.scrollWidth >
            scrollContainerRef.current.clientWidth
        );
      }
    };
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [scrollContainerRef]);

  return (
    <div className='relative w-full max-w-6xl mx-auto py-12'>
      <div className='mb-8 px-4'>
        <h2 className='text-3xl sm:text-4xl font-semibold text-center'>Client Reviews</h2>
      </div>

      {/* Gradient overlay on the left side */}
      <div className='absolute inset-y-0 left-0 w-64 pointer-events-none bg-gradient-to-r from-background via-transparent to-transparent z-10' />

      {/* Gradient overlay on the right side */}
      <div className='absolute inset-y-0 right-0 w-32 pointer-events-none bg-gradient-to-l from-background via-transparent to-transparent z-10' />

      {/* Review Cards in a horizontally scrollable container */}
      {reviews && reviews.length < 1 ? (
        <div className='text-center px-4 py-20'>
          No client review at the moment.
        </div>
      ) : (
        <div className='relative'>
          <div
            ref={scrollContainerRef}
            className='flex items-center justify-start gap-6 overflow-x-auto scroll-smooth no-scrollbar px-16 py-6'>
            {reviews &&
              reviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  img='/logo.webp'
                  name={review.name}
                  position={review.position}
                  body={review.body}
                />
              ))}
          </div>
          {/* Scroll Indicators */}
          {isScrollable && (
            <div className='absolute inset-y-0 left-0 flex items-center'>
              <button
                className='p-2 bg-gray-300 rounded-full hover:bg-gray-400 transition'
                onClick={() =>
                  scrollContainerRef.current?.scrollBy({
                    left: -200,
                    behavior: "smooth",
                  })
                }>
             <ChevronsLeftIcon className="text-blue-600"/>
              </button>
            </div>
          )}
          {isScrollable && (
            <div className='absolute inset-y-0 right-0 flex items-center'>
              <button
                className='p-2 bg-gray-300 rounded-full hover:bg-gray-400 transition'
                onClick={() =>
                  scrollContainerRef.current?.scrollBy({
                    left: 200,
                    behavior: "smooth",
                  })
                }>
               
                  <ChevronsRightIcon className="text-blue-600" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

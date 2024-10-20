"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
// import Image from "next/image";

const reviews = [
  {
    name: "David Anderson",
    username: "Marketing Director, Anderson Corp",
    body: "Tigerkenn Homes exceeded all my expectations! The attention to detail, from the property search to closing, was impeccable. I felt supported every step of the way.",
  },
  {
    name: "Sarah Evans",
    username: "CEO, Evans Tech Solutions",
    body: "The team at Tigerkenn Homes made the home-buying process effortless and stress-free. Their professionalism and personalized approach set them apart in the real estate industry.",
  },
  {
    name: "Michael Thompson",
    username: "Financial Analyst, Global Finance",
    body: "Tigerkenn Homes helped me find the perfect investment property. Their knowledge of the market and negotiation skills saved me a lot of money. Highly recommend!",
  },
  {
    name: "Jessica Roberts",
    username: "Project Manager, BuildIt Inc.",
    body: "I couldn't have asked for a better real estate experience. Tigerkenn Homes provided excellent customer service and found me a home that matches my lifestyle perfectly.",
  },
  {
    name: "Christopher Lee",
    username: "Software Developer, InnovateSoft",
    body: "Tigerkenn Homes made everything so simple! Their expert guidance and commitment to finding the right home were invaluable.",
  },
  {
    name: "Emily Harris",
    username: "HR Manager, BrightPath Consulting",
    body: "The Tigerkenn Homes team is outstanding! They were responsive, knowledgeable, and truly understood what I was looking for in a home.",
  },
  {
    name: "Robert Green",
    username: "Architect, Urban Design Studio",
    body: "Working with Tigerkenn Homes was an amazing experience. Their commitment to quality and customer satisfaction is unmatched in the real estate world.",
  },
  {
    name: "Olivia Carter",
    username: "Entrepreneur, Carter & Co.",
    body: "I found my dream home thanks to Tigerkenn Homes! Their team was patient and provided all the information I needed to make an informed decision.",
  },
  {
    name: "Benjamin Foster",
    username: "Operations Manager, Link Logistics",
    body: "Tigerkenn Homes is truly exceptional. They delivered everything they promised and more. I couldn’t be happier with my new property.",
  },
  {
    name: "Lisa Campbell",
    username: "Creative Director, Campbell Designs",
    body: "From the moment I contacted Tigerkenn Homes, I knew I was in good hands. They listened to my needs and provided tailored options that fit perfectly.",
  },
  {
    name: "Ethan White",
    username: "Lawyer, White & Associates",
    body: "Tigerkenn Homes made what could have been a complicated process incredibly smooth. Their team is efficient, friendly, and always ready to help.",
  },
  {
    name: "Amanda Young",
    username: "Accountant, Prime Numbers LLC",
    body: "I can’t recommend Tigerkenn Homes enough. Their team is professional, efficient, and truly cares about their clients’ satisfaction. I’m beyond happy with my new home!",
  },
];


const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({

  name,
  username,
  body,
}: {
 
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-[300px] cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}>
      <div className='flex flex-row items-center gap-2'>
        {/* <Image
          className='rounded-full'
          width='32'
          height='32'
          alt=''
          src={img}
        /> */}
        <div className='flex flex-col'>
          <figcaption className='text-lg font-medium dark:text-white'>
            {name}
          </figcaption>
          <p className='text-sm font-medium dark:text-white/40'>{username}</p>
        </div>
      </div>
      <blockquote className='mt-2'>{body}</blockquote>
    </figure>
  );
};


const ClientReviews = () => {
  return (
    <div className='relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl'>
      <Marquee pauseOnHover className='[--duration:40s]'>
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className='[--duration:40s]'>
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className='pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background'></div>
      <div className='pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background'></div>
    </div>
  );
}

export default ClientReviews

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const MobileViewGuidelines = () => {
  const [view, setView] = useState(false);

  return (
    <div className='lg:hidden border rounded-xl overflow-hidden mb-6'>
      <div
        onClick={() => setView(!view)}
        className='cursor-pointer flex items-center justify-between bg-gray-200 dark:bg-gray-800 transition-all transform duration-700 ease-out px-3 py-2'>
        <h1 className='text-lg '>Discussion guidelines.</h1>
        {view ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
      </div>

      {view && (
        <div className='p-3 transition-all transform duration-700 ease-out'>
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='item-1'>
              <AccordionTrigger>No Self-Promotion</AccordionTrigger>
              <AccordionContent>
                Posts with overt self-promotion may be removed to keep
                discussions authentic and valuable to all members.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>Be Patient and Welcoming</AccordionTrigger>
              <AccordionContent>
                We all come from different backgrounds and levels of expertise.
                Be respectful, patient, and encouraging towards others.
                Constructive feedback and supportive engagement create an
                inclusive and vibrant community.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>No Job Listings</AccordionTrigger>
              <AccordionContent>
                This forum is not a place for job postings, recruitment
                advertisements, or headhunting. Please reserve job-related
                discussions for appropriate platforms or dedicated channels.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4'>
              <AccordionTrigger>
                Discuss Perspectives, Advice, and Insights
              </AccordionTrigger>
              <AccordionContent>
                Share your perspectives and offer thoughtful advice and insights
                to fellow community members. Focus on discussions that encourage
                knowledge exchange, problem-solving, and mutual learning.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default MobileViewGuidelines;

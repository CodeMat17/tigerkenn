// /app/contact/page.tsx (Client Component)
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  return (
    <div className='max-w-lg mx-auto py-12 px-4 sm:px-6 lg:px-8 dark:text-gray-400'>
      <h1 className='text-3xl font-bold mb-6'>Contact Us</h1>
      <form className='space-y-4'>
        <div className='mb-4'>
          <label className='block text-sm'>Name</label>
          <Input
            type='text'
            id='name'
            className='w-full mt-1 p-2 border rounded-lg border-gray-400'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm'>Email</label>
          <Input
            type='email'
            id='email'
            className='w-full mt-1 p-2 border border-gray-400 rounded-lg'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='message' className='block text-sm'>
            Message
          </label>
          <Textarea
            id='message'
            className='w-full mt-1 p-2 border rounded-lg border-gray-400
 
            
            '></Textarea>
        </div>
        <Button
          type='submit'
          className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600'>
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default ContactPage;

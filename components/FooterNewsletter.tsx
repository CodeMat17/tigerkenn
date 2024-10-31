import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';

const FooterNewsletter = () => {
  return (
    <div className='mt-3'>
      <Input
        type='email'
        placeholder='Enter your email here'
        className='bg-gray-800'
        required
      />
      <div className='flex justify-end mt-2'>
        <Button>Subscribe</Button>
      </div>
    </div>
  );
}

export default FooterNewsletter
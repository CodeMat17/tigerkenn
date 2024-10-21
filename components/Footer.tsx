import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <div className='z-50 w-full px-4 py-8 bg-gray-900 text-gray-400'>
      <div className='w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8 '>
        <div className='w-full sm:w-[300px]'>
          <div className='flex items-center gap-3'>
            <Image
              alt=''
              priority
              width={70}
              height={70}
              src='/logo.webp'
              className='invert'
            />
            <h2 className='font-semibold text-2xl text-gray-300'>
              Tigerkenn Homes
            </h2>
          </div>
          <p className='text-sm'>
            Founded on the principles of quality, integrity, and innovation, we
            are dedicated to providing comprehensive solutions for all your
            housing and construction needs.
          </p>
        </div>
        <div className='mt-3 sm:mx-auto'>
          <h3 className='font-medium text-lg text-gray-300'>Quick Links</h3>
          <div className='flex flex-col justify-start items-start'>
            <Button
              asChild
              variant='ghost'
              className='hover:bg-gray-800 hover:text-white'>
              <Link href='/'>Home</Link>
            </Button>
            <Button
              asChild
              variant='ghost'
              className='hover:bg-gray-800 hover:text-white'>
              <Link href='/about-us'>About Us</Link>
            </Button>
            <Button
              asChild
              variant='ghost'
              className='hover:bg-gray-800 hover:text-white'>
              <Link href='/listings'>Listings</Link>
            </Button>
            <Button
              asChild
              variant='ghost'
              className='hover:bg-gray-800 hover:text-white'>
              <Link href='/blogs'>Blog Posts</Link>
            </Button>
            <Button
              asChild
              variant='ghost'
              className='hover:bg-gray-800 hover:text-white'>
              <Link href='/contact-us'>Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

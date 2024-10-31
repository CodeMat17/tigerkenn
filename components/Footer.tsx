import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import FooterNewsletter from "./FooterNewsletter";

const Footer = () => {
  return (
    <div>
      <div className='z-50 w-full px-4 py-8 bg-gray-900 text-gray-400'>
        <div className='w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8 '>
          <div className='w-full sm:w-[300px]'>
            <div className='flex items-center gap-3'>
              <Link href='/'>
                <Image
                  alt=''
                  priority
                  width={70}
                  height={70}
                  src='/logo.webp'
                  className='invert'
                />
              </Link>

              <h2 className='font-semibold text-2xl text-gray-300'>
                Tigerkenn Homes
              </h2>
            </div>
            <p className='text-sm'>
              Founded on the principles of quality, integrity, and innovation,
              we are dedicated to providing comprehensive solutions for all your
              housing and construction needs.
            </p>
          </div>
          <div className='mt-3 sm:mx-auto'>
            <h3 className='font-medium text-lg text-gray-300'>Quick Links</h3>
            <div className='flex flex-col justify-start items-start'>
              <Button
                aria-label='nav link'
                asChild
                variant='ghost'
                className='hover:bg-gray-800 hover:text-white'>
                <Link aria-label='nav link' href='/'>
                  Home
                </Link>
              </Button>
              <Button
                aria-label='nav link'
                asChild
                variant='ghost'
                className='hover:bg-gray-800 hover:text-white'>
                <Link aria-label='nav link' href='/about-us'>
                  About Us
                </Link>
              </Button>
              <Button
                aria-label='nav link'
                asChild
                variant='ghost'
                className='hover:bg-gray-800 hover:text-white'>
                <Link aria-label='nav link' href='/listings'>
                  Listings
                </Link>
              </Button>
              <Button
                aria-label='nav link'
                asChild
                variant='ghost'
                className='hover:bg-gray-800 hover:text-white'>
                <Link aria-label='nav link' href='/blogs'>
                  Blog Posts
                </Link>
              </Button>
              <Button
                aria-label='nav link'
                asChild
                variant='ghost'
                className='hover:bg-gray-800 hover:text-white'>
                <Link aria-label='nav link' href='/contact-us'>
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
          <div className='mt-3'>
            <h3 className='font-medium text-lg text-gray-300'>Social Media</h3>
            <div className='flex gap-3 mt-3'>
              <div className='relative w-[40px] h-[40px]'>
                <Link href='/'>
                  <Image
                    alt=''
                    priority
                    fill
                    src='/socials/facebook.png'
                    className=''
                  />
                </Link>
              </div>

              <div className='relative w-[40px] h-[40px]'>
                <Link href='/'>
                  <Image
                    alt=''
                    priority
                    fill
                    src='/socials/whatsapp.png'
                    className=' '
                  />
                </Link>
              </div>

              <div className='relative w-[40px] h-[40px]'>
                <Link href='/contact-us'>
                  <Image
                    alt=''
                    priority
                    fill
                    src='/socials/mail.png'
                    className=' '
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className='mt-3'>
            <h3 className='font-medium text-lg text-gray-300'>
              Subscribe to our newsletter
            </h3>
           <FooterNewsletter />
          </div>
        </div>
      </div>
      <div className='bg-gray-950 p-4 text-gray-500'>
        <p>
          &copy; <span id='current-year'>2024</span> Tigerkenn Homes. All rights
          reserved.
        </p>
        <p className='text-sm'>
          Unauthorized use and/or duplication of the materials herein without
          express and written permission from this site&apos;s author and/or
          owner is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default Footer;

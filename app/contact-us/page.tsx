import ContactForm from "@/components/ContactForm";
import Image from "next/image";
import Link from "next/link";

const ContactUs = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12'>
      <div className='max-w-5xl mx-auto px-6 sm:px-8'>
        <div className='text-center mb-2 flex flex-col justify-center items-center'>
          <h2 className='text-3xl font-semibold sm:text-4xl'>
            Get in Touch with Us
          </h2>
          <p className='mt-4 text-gray-500 dark:text-gray-400'>
            We&apos;d love to hear from you! Send us a message, and we&apos;ll
            respond as soon as possible.
          </p>
          <Image
            alt=''
            priority
            width={180}
            height={180}
            src='/gifs/message.gif'
            className='dark:invert'
          />
        </div>

        <div className='flex flex-col md:flex-row gap-12'>
          {/* Contact Form */}
          <div className='w-full md:w-[60%]'>
            <ContactForm />
          </div>

          {/* Contact Details */}
          <div className='space-y-6 dark:text-gray-400 w-full md:w-[40%]'>
            <div>
              <h3 className='font-semibold dark:text-gray-300 text-xl'>
               Instant Contact
              </h3>
              <div className='mt-2 flex gap-4'>
                <div>
                  <Link href='tel:+2348033350750'>
                    <Image
                      alt=''
                      priority
                      width={40}
                      height={40}
                      src='/gifs/phone.gif'
                      className='dark:invert rounded-full mb-1'
                    />
                    <label className='text-sm'>Call Us</label>
                  </Link>
                </div>
                <div>
                  <Link href='https://wa.me/2348033350750'>
                    <Image
                      alt=''
                      priority
                      width={40}
                      height={40}
                      src='/gifs/chat.gif'
                      className='dark:invert rounded-xl mb-1'
                    />
                    <label className='text-sm'>Chat With Us</label>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-xl font-semibold dark:text-gray-300'>
                Office Address
              </h3>
              <p className='mt-2'>
                1234 Example Street, Suite 100 <br />
                City, State.
              </p>
            </div>
            <div>
              <h3 className='text-xl font-semibold dark:text-gray-300'>
                Working Hours
              </h3>
              <p className='mt-2'>
                Monday - Saturday: 9:00 AM - 5:00 PM <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// import { Resend } from 'resend';

// const resend = new Resend('re_K84iEPM5_PTYpW4xC8VYRqHGFiciSb3QJ');

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'support@tigerkennhomes.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });

export default ContactUs;

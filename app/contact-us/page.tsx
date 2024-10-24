import ContactForm from "@/components/ContactForm";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Tigerkenn Homes for inquiries, support, or more information about our real estate services. We're here to assist you with all your property needs and provide you with the best solutions.",
};


export const revalidate = 0

const ContactUs = async () => {

  const supabase = createClient();

  const { data: contact } = await supabase
    .from("contact")
    .select("*")
    .single();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12'>
      <div className='max-w-5xl mx-auto px-6 sm:px-8'>
        <div className='text-center mb-2 flex flex-col justify-center items-center'>
          <h2 className='text-3xl font-semibold sm:text-4xl'>
            {contact.title}
          </h2>
          <p className='mt-4 text-gray-500 dark:text-gray-400'>
            {contact.subtitle}
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
                  <Link
                    href={`tel:+${contact.phone}`}
                    className='flex flex-col items-center'>
                    <Image
                      alt=''
                      priority
                      width={50}
                      height={50}
                      src='/gifs/phone.gif'
                      className='dark:invert rounded-xl mb-1 transition transform duration-500 ease-in hover:scale-110'
                    />
                    <label className='text-sm'>Call Us</label>
                  </Link>
                </div>
                <div>
                  <Link
                    href={`https://wa.me/${contact.whatsapp}`}
                    className='flex flex-col items-center'>
                    <Image
                      alt=''
                      priority
                      width={50}
                      height={50}
                      src='/gifs/chat.gif'
                      className='dark:invert rounded-xl mb-1 transition transform duration-500 ease-in hover:scale-x-110 hover:bg-blue-100'
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
              <p className='mt-2'>{contact.address}</p>
            </div>
            <div>
              <h3 className='text-xl font-semibold dark:text-gray-300'>
                Working Hours
              </h3>
              {/* <p className='mt-2'>
                Monday - Saturday: 9:00 AM - 5:00 PM <br />
                Sunday: Closed
              </p> */}
              <div
                className='animate-fadeIn max-w-none dark:text-gray-300 mt-2'
                dangerouslySetInnerHTML={{ __html: contact.hours }}
              />
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

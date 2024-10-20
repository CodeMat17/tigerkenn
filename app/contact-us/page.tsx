import ContactForm from "@/components/ContactForm";

const ContactUs = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950 py-12'>
      <div className='max-w-5xl mx-auto px-6 sm:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-semibold sm:text-4xl'>
            Get in Touch with Us
          </h2>
          <p className='mt-4 text-gray-500 dark:text-gray-400'>
            We&apos;d love to hear from you! Send us a message, and we&apos;ll
            respond as soon as possible.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Details */}
          <div className='space-y-6 dark:text-gray-400 '>
            <div>
              <h3 className='font-semibold dark:text-gray-300 text-xl'>
                Contact Information
              </h3>
              <p className='mt-2'>
                <strong>Email:</strong> support@example.com
              </p>
              <p className='mt-1'>
                <strong>Phone:</strong> +234 806 7890 000
              </p>
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

export default ContactUs;

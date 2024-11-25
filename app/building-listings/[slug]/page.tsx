// /app/listing/[id]/page.tsx
import ListingGallery from "@/components/ListingGallery";
import ShareButton from "@/components/ShareButton";
import { createClient } from "@/utils/supabase/server";
import { Bath, BedDoubleIcon, MapPin, Ruler } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("listings")
    .select("title, slug, img")
    .eq("slug", params.slug)
    .single();

  return {
    title: data?.title || "Listing details",
    description:
      data?.slug ||
      "View detailed information about this property listing, including images, pricing, and key features. Find your perfect property or investment opportunity with Tigerkenn Homes.",
    openGraph: {
      title: data?.title || "Listing details",
      description:
        `Read more about: ${data?.slug}` ||
        "View detailed information about this property listing, including images, pricing, and key features. Find your perfect property or investment opportunity with Tigerkenn Homes.",
      images: [
        {
          url:
            data?.img ||
            "https://res.cloudinary.com/dusg2xagv/image/upload/v1730245213/og-image/qtu9wrhthbw7iw6gupur.jpg",
          type: "image",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}



// function getUserNameFromEmail(email: string | undefined): string | null {
//   if (!email) return null;
//   const [username] = email.split("@");
//   return username;
// }



const ListingDetails = async ({ params: { slug } }: Props) => {
  const supabase = createClient();

  // Check if a user's logged in
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();



  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!listing || error) {
    notFound();
    return null;
  }

  if (listing) {
    const baseUrl = process.env.NEXT_PUBLIC_HOME || "http://localhost:3000";
    await fetch(`${baseUrl}/api/listing-views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch((fetchError) => {
      // Log error if in development, but do not interrupt the user
      if (process.env.NODE_ENV === "development") {
        console.error("View count update failed:", fetchError);
      }
    });
  }

  return (
    <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      {/* Title */}
      <h1 className='text-2xl sm:text-3xl dark:text-gray-400 font-semibold mb-6'>
        {listing.title}
      </h1>

      {/* Location and Status */}
      <div className='flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-3'>
        <div className='flex items-center gap-1'>
          <MapPin className='w-5 h-5 text-red-500' />
          <p>{listing.location}</p>
        </div>
        {listing.available ? (
          <span className='px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full'>
            {listing.status}
          </span>
        ) : (
          <span className='px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full'>
            Unavailable
          </span>
        )}
        <ShareButton />
      </div>

      {/* Image Gallery */}

      <ListingGallery
        mainImage={listing.img}
        thumbnails={listing.other_imgs}
        title={listing.title}
      />

      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 shadow-md rounded-xl bg-blue-200 dark:bg-gray-800`}>
        <div className='text-3xl font-bold text-blue-600'>
          ₦{listing.price.toLocaleString()}
        </div>

        <div className='flex items-center space-x-6 mt-3 md:mt-0'>
          {/* Beds */}
          {listing.beds && (
            <div className='flex flex-col md:flex-row justify-center items-center md:gap-2'>
              <BedDoubleIcon className='w-6 h-6 text-blue-500' />
              <p className='text-sm text-center'>{listing.beds} beds</p>
            </div>
          )}

          {/* Baths */}
          {listing.baths && (
            <div className='flex flex-col md:flex-row justify-center items-center md:gap-2'>
              <Bath className='w-6 h-6 text-blue-500' />
              <p className='text-sm text-center'>{listing.baths} baths</p>
            </div>
          )}

          {/* Square Feet */}
          {listing.sqm && (
            <div className='flex flex-col md:flex-row justify-center items-center md:gap-2'>
              <Ruler className='w-6 h-6 text-blue-500' />
              <p className='text-sm text-center'>{listing.sqm} Sqm</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className='dark:text-gray-400 mt-5 mb-8'>
        <h2 className='text-2xl font-medium mb-4'>Description</h2>
        <div
          className='text-[17px] leading-relaxed [&_p]:-my-1'
          dangerouslySetInnerHTML={{ __html: listing.desc }}
        />
      </div>

      {/* Video (Optional) */}
      {listing.video && (
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Video Tour</h2>
          <div className='relative w-full h-96'>
            <iframe
              className='absolute top-0 left-0 w-full h-full rounded-lg'
              src={listing.video}
              title='Video Tour'
              frameBorder='0'
              allow='autoplay; encrypted-media'
              allowFullScreen></iframe>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default ListingDetails;

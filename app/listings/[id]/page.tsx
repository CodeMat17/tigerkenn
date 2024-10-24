// /app/listing/[id]/page.tsx
import ListingsComments from "@/components/ListingsComments";
import ScrollableProperties from "@/components/ScrollableProperties";
import { createClient } from "@/utils/supabase/server";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Property Listing",
  description:
    "View detailed information about this property listing, including images, pricing, and key features. Find your perfect home or investment opportunity with Tigerkenn Homes.",
};

export const revalidate = 0;

function getUserNameFromEmail(email: string | undefined): string | null {
  if (!email) {
    return null;
  }

  const [username] = email.split("@");
  return username;
}

type Props = {
  params: {
    id: string;
  };
};

const ListingDetails = async ({ params: { id } }: Props) => {
  const supabase = createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

 
  const username = getUserNameFromEmail(user?.email);

 

  
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!listing || error) {
    notFound();
    return null;
  }

  return (
    <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      {/* Title */}
      <h1 className='text-2xl sm:text-3xl dark:text-gray-400 font-semibold mb-6'>
        {listing.title}
      </h1>
      {/* Location and Status */}
      <div className='flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4'>
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
      </div>
      {/* Image */}
      <Image
        priority
        width={700}
        height={394}
        src={listing.img}
        alt={listing.title}
        className='rounded-lg mb-1 w-full h-96 aspect-video object-cover'
      />
      <ScrollableProperties
        price={listing.price != null ? listing.price.toLocaleString() : "N/A"}
        beds={listing.beds}
        baths={listing.baths}
        sqm={listing.sqm}
        other_imgs={listing.other_imgs}
      />
      {/* Property Details */}

      {/* Description */}
      <div className='dark:text-gray-400 mt-5 mb-8'>
        <h2 className='text-2xl font-medium  mb-4'>Description</h2>
        <div
          className='text-[17px] leading-relaxed  [&_p]:-my-1'
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
      {/* Comments Section */}
      <ListingsComments id={listing.id} user={user} username={username} />
    </div>
  );
};

export default ListingDetails;

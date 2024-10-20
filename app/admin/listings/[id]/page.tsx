import UpdateListingPage from "@/components/admin/UpdateListingPage";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
};

const Update = async ({ params: { id } }: Props) => {
  const supabase = createClient();

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
    <div className='py-12 w-full min-h-screen max-w-xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold mb-6'>Update Listings</h1>

      <UpdateListingPage id={listing.id} listTitle={listing.title} listLocation={listing.location} listDesc={listing.desc} listPrice={listing.price} listBeds={listing.beds} listBaths={listing.baths} listSqm={listing.sqm} listStatus={listing.status} listImg={listing.img} listOtherImgs={listing.other_imgs} />
    </div>
  );
};

export default Update;

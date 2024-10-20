import DeleteReview from "@/components/DeleteReview";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const Reviews = async () => {
  const supabase = createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className='py-10 w-full min-h-screen'>
      <h1 className='text-center text-3xl font-semibold'>Clients Reviews</h1>
      <div className='flex justify-center my-3 '>
        <Button asChild>
          <Link href='/admin/reviews/add-new-review'>Add review</Link>
        </Button>
      </div>

      <div className='flex justify-center'>
        {!reviews ? (
          <p className='text-center py-20'>No reviews yet.</p>
        ) : reviews && reviews?.length < 1 ? (
          <p className='text-center py-20'>No reviews yet.</p>
        ) : (
          <div className='flex flex-wrap justify-center gap-4'>
            {reviews &&
              reviews.map((review) => (
                <div key={review.id} className="relative group border-gray-400 dark:border-gray-500">
                  <Link href={`/admin/reviews/${review.id}`}>
                    <div className='border rounded-xl mt-8 p-4 max-w-[310px]'>
                      <p className='mb-3 dark:text-gray-300 border-b pb-4'>
                        {review.body}
                      </p>

                      <h3 className='text-sm text-gray-500 dark:text-gray-400'>
                        {review.name}
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {review.position}
                      </p>
                    </div>
                  </Link>
                  <DeleteReview id={review.id} rBody={review.body} rPosition={review.position} rName={review.name} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;

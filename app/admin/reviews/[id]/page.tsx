import ReviewEdit from "@/components/ReviewEdit";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const ReviewEditPage = async ({ params: { id } }: Props) => {
  const supabase = createClient();

  const { data: review, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (!review || error) {
    notFound();
    return null;
  }

  return (
    <div className='py-10 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center mb-8 '>Edit Review</h1>

      <ReviewEdit
        id={review.id}
        reviewName={review.name}
        reviewPosition={review.position}
        reviewBody={review.body}
      />
    </div>
  );
};

export default ReviewEditPage;

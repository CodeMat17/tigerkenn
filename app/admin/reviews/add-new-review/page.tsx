"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// type Props = {
//   id: string;
//   reviewName: string;
//   reviewPosition: string;
//   reviewBody: string;
// };

const AddNewReview = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    formData.append("body", body);

    try {
      const res = await fetch(`/api/review-add-new`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (res.ok) {
        toast("DONE!!", { description: "Review added successfully" });
          setName('')
          setPosition('')
          setBody('')
        router.push("/admin/reviews");
      } else {
        console.error("Error adding review:", result.error);
        toast.error("ERROR!", { description: `${result.error}` });
      }
    } catch (error) {
      console.log("Error adding review: ", error);
      toast.error("ERROR!", {
        description: `Error adding review: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <h1 className='text-3xl text-center mb-8 '>Add Review</h1>
      <div>
        <label className='mb-1 text-sm text-gray-400'>Client&apos;s name</label>
        <Input
          placeholder="Client's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='bg-gray-100 dark:bg-gray-900 border-none'
        />
      </div>

      <div>
        <label className='mb-1 text-sm text-gray-400'>
          Client&apos;s position
        </label>
        <Input
          placeholder="Client's position"
          maxLength={35}
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className='bg-gray-100 dark:bg-gray-900 border-none'
        />
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          {position.length}/35 characters
        </p>
      </div>

      <div>
        <label className='mb-1 text-sm text-gray-400'>
          Client&apos;s review (max characters - 200)
        </label>
        <Textarea
          placeholder="Client's review"
          maxLength={200}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className='bg-gray-100 dark:bg-gray-900 border-none'
        />
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          {body.length}/200 characters
        </p>
      </div>

      <Button onClick={handleSubmit} className='w-full'>
        {loading ? <MinusIcon className='animate-spin' /> : "Submit"}
      </Button>
    </div>
  );
};

export default AddNewReview;

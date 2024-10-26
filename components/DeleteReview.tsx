"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MinusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Props = {
  id: string;
  rName: string;
  rPosition: string;
  rBody: string;
};

const DeleteReview = ({ id, rName, rPosition, rBody }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("id", id);
    console.log("ID:", id);

    try {
      const res = await fetch("/api/delete-review", {
        method: "DELETE",
        body: formData,
      });
      const result = await res.json();

      if (res.ok) {
        toast("DONE!!", { description: "Review deleted successfully" });
        setOpen(false);
      } else {
        console.error("Error deleting review:", result.error);
        toast.error("ERROR!", { description: `${result.error}` });
      }
    } catch (error) {
      console.error("Error during deletion process:", error);
      toast.error("ERROR!", {
        description: "An error occurred while deleting the review.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='absolute right-0 bottom-0'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className='text-red-500 transition transform duration-300 ease-in-out  hover:bg-red-500 hover:text-red-200 p-3 rounded-full'>
          <TrashIcon />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this review?
            </DialogTitle>
          </DialogHeader>
          <div className='text-sm'>
            <p className='border-b pb-3 mb-3'>{rBody}</p>
            <p>
              From: {rName}, {rPosition}
            </p>
          </div>
          <DialogFooter>
            <Button aria-label="delete button" onClick={handleDelete}>
              {loading ? (
                <MinusIcon className='animate-spin w-8 h-8 shrink-0' />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteReview;

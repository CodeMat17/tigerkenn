"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MinusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  title: string;
};

const DeleteThread = ({ id, title }: Props) => {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    // const formData = new FormData();
    // formData.append("id", id);
    // console.log("ID:", id);

    try {
      const res = await fetch("/api/delete-thread", {
        method: "DELETE",
        body: JSON.stringify({id}),
      });
      const result = await res.json();

      if (res.ok) {
        toast("DONE!!", { description: "Thread deleted successfully" });
        setOpen(false);
        router.refresh()
        router.push('/threads/topics')
      } else {
        console.error("Error deleting thread:", result.error);
        toast.error("ERROR!", { description: `${result.error}` });
      }
    } catch (error) {
      console.error("Error during deletion process:", error);
      toast.error("ERROR!", {
        description: "An error occurred while deleting thread.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='flex items-center justify-center  text-white bg-red-500 px-2 py-0.5 rounded-full font-normal'>
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle>
            Are you sure you want to delete this thread?
          </DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            aria-label='delete button'
            onClick={handleDelete}
            className='flex items-center'>
            {loading ? (
              <MinusIcon className='animate-spin w-5 h-5 shrink-0' />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteThread;

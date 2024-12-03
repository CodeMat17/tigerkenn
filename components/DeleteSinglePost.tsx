"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MinusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  id: number;
  title: string;
  classnames?: string;
};

const DeleteSinglePost = ({ id, title, classnames }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/delete-thread", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      const result = await res.json();

      if (res.ok) {
        toast("DONE!!", { description: "Thread deleted successfully" });
        setOpen(false);
        router.refresh();
        router.push("/threads/topics");
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
      <DialogTrigger asChild>
        <button className={`${classnames} flex items-center text-red-500`}>
          <Trash2Icon className='mr-1 w-5 h-5' /> Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='text-start'>
          <DialogTitle>
            Are you sure you want to delete this thread?
          </DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2'>
          <Button onClick={() => setOpen(false)}>Close</Button>

          <Button
            aria-label='delete button'
            variant='outline'
            onClick={handleDelete}
            className='flex items-center text-red-500 border-red-500'>
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

export default DeleteSinglePost;

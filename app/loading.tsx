import { MinusIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className='w-full py-32 flex items-center justify-center gap-4'>
      <MinusIcon className='animate-spin' /> <p className='text-2xl'>|</p>{" "}
      <p>Please wait...</p>
    </div>
  );
};

export default Loading;

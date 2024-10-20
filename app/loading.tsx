import { MinusIcon } from "lucide-react";

const Loading = () => {
  return (
    <div className='w-full py-32 flex items-center justify-center'>
      <MinusIcon className='animate-spin mr-3' /> Loading data...
    </div>
  );
};

export default Loading;

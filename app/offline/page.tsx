import LogoComponemt from "@/components/LogoComponent";

const OfflinePage = () => {
  return (
    <div className='flex h-screen items-center justify-center px-4 py-16 text-white bg-gray-950'>
      <div className='text-center space-y-2'>
        <div className='flex justify-center'>
          <LogoComponemt />
        </div>

        <h1 className='text-4xl font-semibold'>Tigerkenn Homes</h1>
        <p className='text-lg'>You’re currently offline</p>
        <p className='text-lg'>
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
};

export default OfflinePage;

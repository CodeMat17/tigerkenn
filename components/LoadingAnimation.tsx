import React from 'react'

const LoadingAnimation = () => {
  return (
    <div className='flex justify-center items-center space-x-0.5 mt-3'>
      <div className='w-1 h-1 bg-blue-500 rounded-full animate-bounce'></div>
      <div className='w-1 h-1 bg-blue-500 rounded-full animate-bounce animation-delay-200'></div>
      <div className='w-1 h-1 bg-blue-500 rounded-full animate-bounce animation-delay-400'></div>
    </div>
  );
}

export default LoadingAnimation
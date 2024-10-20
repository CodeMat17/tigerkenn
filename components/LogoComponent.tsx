import Image from "next/image";

const LogoComponemt = () => {
  return (
    <Image
      alt='logo'
      priority
      width={65}
      height={65}
      src='/logo.webp'
      className='invert'
    />
  );
};

export default LogoComponemt;

import Image from "next/image";
import Link from "next/link";

const LogoComponemt = () => {
  return (
    <Link href='/'>
     <Image
      alt='logo'
      priority
      width={65}
      height={65}
      src='/logo.webp'
      className='dark:invert'
    />
    </Link>
   
  );
};

export default LogoComponemt;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/listings", label: "Listings" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact-us", label: "Contact Us" },
  // Add more links as needed...
];

const DesktopNav = () => {
  const pathname = usePathname();
  console.log("Pathname: ", pathname);

  return (
    <div className='hidden md:flex gap-1.5'>
      {links.map((link, index) => (
        <Button key={index} asChild variant='ghost' className={`text-white hover:bg-blue-900 hover:text-white ${link.href === pathname ? 'bg-blue-800' : ''} `}>
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </div>
  );
};

export default DesktopNav;

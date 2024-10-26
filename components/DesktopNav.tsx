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

  return (
    <div className='hidden md:flex gap-1.5'>
      {links.map((link, index) => (
        <Button aria-label="desktop nav link" key={index} asChild variant='ghost' className={`transition-all transform duration-500 ease-out text-white hover:bg-gray-800/30 hover:text-white ${link.href === pathname ? 'bg-gray-800/20' : ''} `}>
          <Link aria-label="desktop nav link" href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </div>
  );
};

export default DesktopNav;

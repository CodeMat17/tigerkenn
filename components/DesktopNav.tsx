"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/threads/topics", label: "Threads" },
  { href: "/land-listings", label: "Land Listings" },
  { href: "/building-listings", label: "Building Listings" },
  { href: "/blogs", label: "Blog Posts" },
  { href: "/contact-us", label: "Contact Us" },
  // Add more links as needed...
];

const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <div className='hidden lg:flex gap-1'>
      {links.map((link, index) => {

        const isActive =
          link.href === pathname ||
          (link.href === "/blogs" && pathname.startsWith("/blogs")) ||
          (link.href === "/land-listings" &&
            pathname.startsWith("/land-listings")) ||
          (link.href === "/building-listings" &&
            pathname.startsWith("/building-listings"));

        return (
        <Button aria-label="desktop nav link" key={index} asChild variant='ghost' className={`transition-all transform duration-500 ease-out text-white hover:bg-gray-800/30 hover:text-white ${isActive ? 'bg-gray-800/20' : ''} `}>
          <Link aria-label="desktop nav link" href={link.href}>{link.label}</Link>
        </Button>
      )})}
    </div>
  );
};

export default DesktopNav;

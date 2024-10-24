"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlignRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Ensure you import this

const navs = [
  { title: "HOME", href: "/" },
  { title: "ABOUT US", href: "/about-us" },
  { title: "LISTINGS", href: "/listings" },
  { title: "BLOG", href: "/blogs" },
  { title: "CONTACT US", href: "/contact-us" },
];

const MobileSheet = () => {
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            onClick={() => setOpen(true)}
            className='hover:bg-gray-800'>
            {isClient && <AlignRightIcon className='text-white ' />}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className='pb-8 h-screen flex flex-col gap-4 justify-center items-center text-start'>
            {navs.map((nav, i) => (
              <Button
                key={i}
                asChild
                variant='ghost'
                onClick={handleClose}
                className='w-full'>
                <Link href={nav.href} className='text-xl tracking-wide'>
                  {nav.title}
                </Link>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSheet;

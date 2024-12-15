"use client";

import LogoComponent from "@/components/LogoComponent";
import ModeToggle from "@/components/ModeToggle";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DesktopNav from "./DesktopNav";
import MobileSheet from "./MobileSheet";
import SignoutComponent from "./SignoutComponent";
import { Button } from "./ui/button";

const HeaderNav = ({ user }: { user: User | null }) => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router, user]);

  return (
    <div className='w-full sticky top-0 z-50 px-2 sm:px-4 py-2 bg-background/30 backdrop-blur supports-[backdrop-filter]:bg-background/30'>
      <div className='flex items-center justify-between max-w-6xl mx-auto'>
        <div className='flex items-center lg:gap-x-16'>
          <LogoComponent />
          <DesktopNav />
        </div>

        <div className='flex items-center gap-4'>
          <ModeToggle />
          <div className='flex items-center'>
            {user ? (
              <SignoutComponent />
            ) : (
              <Button
                asChild
                aria-label='Open mobile menu'
                aria-expanded='false'
                aria-controls='mobile-menu'
                className='rounded-full'>
                <Link aria-label='Open mobile menu' href='/login'>
                  Login | Sign Up
                </Link>
              </Button>
            )}
          </div>
          <MobileSheet />
        </div>
      </div>
    </div>
  );
};

export default HeaderNav;

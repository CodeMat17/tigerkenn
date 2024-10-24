import LogoComponent from "@/components/LogoComponent";
import ModeToggle from "@/components/ModeToggle";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import DesktopNav from "./DesktopNav";
import MobileSheet from "./MobileSheet";
import SignoutComponent from "./SignoutComponent";
import { Button } from "./ui/button";

const HeaderNav = async () => {
  const supabase = createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='w-full sticky top-0 z-50 px-2 sm:px-4 py-2 bg-sky-900/80 dark:bg-sky-600/70 backdrop-filter backdrop-blur-md'>
      <div className='flex items-center justify-between max-w-6xl mx-auto'>
        <LogoComponent />
        <div className='flex items-center gap-4'>
          <ModeToggle />

          <DesktopNav />
          <div className='flex items-center'>
            {user ? (
              <SignoutComponent />
            ) : (
              <Button asChild className="rounded-full">
                <Link href='/login'>Login | Sign Up</Link>
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

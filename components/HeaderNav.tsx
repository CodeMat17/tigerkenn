import ModeToggle from "@/components/ModeToggle";
import LogoComponent from "@/components/LogoComponent";
import MobileSheet from "./MobileSheet";
import DesktopNav from "./DesktopNav";

const HeaderNav = () => {
  return (
    <div className='w-full sticky top-0 z-50 px-2 sm:px-4 py-2 bg-sky-900/80 dark:bg-sky-600/70 backdrop-filter backdrop-blur-md'>
      <div className='flex items-center justify-between max-w-6xl mx-auto'>
        <LogoComponent />
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <MobileSheet />
          <DesktopNav />
        </div>
      </div>
    </div>
  );
};

export default HeaderNav;

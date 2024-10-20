import {
  HomeIcon,
  LayoutPanelLeftIcon,
  RssIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const SideNav = () => {
  return (
    <nav className='hidden md:flex md:flex-col items-center py-8 md:w-32 lg:w-72 text-white  h-screen p-4 bg-gray-900'>
      <nav className='flex flex-col gap-4 items-start justify-start py-12'>
        <Button
          asChild
          className='space-x-3 dark:text-white dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-950'>
          <Link href='/admin'>
            <HomeIcon size={24} /> <span className='hidden lg:flex'>Home</span>
          </Link>
        </Button>

        <Button
          asChild
          className='space-x-3 dark:text-white dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-950'>
          <Link href='/admin/about-us'>
            <UsersIcon size={24} />{" "}
            <span className='hidden lg:flex'>About Us</span>
          </Link>
        </Button>

        <Button
          asChild
          className='space-x-3 dark:text-white dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-950'>
          <Link href='/admin/listings'>
            <LayoutPanelLeftIcon size={24} />{" "}
            <span className='hidden lg:flex'>Listings</span>
          </Link>
        </Button>

        <Button
          asChild
          className='space-x-3 dark:text-white dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-950'>
          <Link href='/admin/blog'>
            <RssIcon size={24} /> <span className='hidden lg:flex'>Blog</span>
          </Link>
        </Button>

        <Button
          asChild
          className='space-x-3 dark:text-white dark:bg-gray-900 hover:bg-gray-800 dark:hover:bg-gray-950'>
          <Link href='/admin/reviews'>
            <StarIcon size={24} /> <span className='hidden lg:flex'>Clients Review</span>
          </Link>
        </Button>
      </nav>
    </nav>
  );
};

export default SideNav;

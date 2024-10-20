import SideNav from "@/components/admin/SideNav";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-screen'>
      {/* SideNav Component */}
      <SideNav />

      {/* Main Content */}
      <div className='flex-grow h-screen overflow-y-auto p-4'>{children}</div>
    </div>
  );
}

// /app/about/page.tsx (Server Component)
import AboutUsIntro from "@/components/about-us/AboutUsIntro";
import OurMission from "@/components/about-us/OurMission";
import OurServices from "@/components/about-us/OurServices";
import WhyChooseUs from "@/components/about-us/WhyChooseUs";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className='max-w-7xl min-h-screen mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-4xl font-bold text-center mb-8'>About Us</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
        <AboutUsIntro />
        <Image
          src='/svgs/construction-animate.svg'
          alt='Team'
          width={600}
          height={500}
          className='object-cover md:max-w-sm mx-auto aspect-square'
        />
      </div>
      <OurServices />
      <OurMission />
      <WhyChooseUs />
    </div>
  );
};

export default AboutPage;

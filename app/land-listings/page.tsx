import LandListingsComponent from "@/components/LandListingsComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Explore a diverse range of property listings at Tigerkenn Homes. Discover your ideal home or investment opportunity with detailed property information, images, and pricing tailored to your needs.",
};

const ListingsPage: React.FC = () => {
  return (
    <div>
      <LandListingsComponent />
    </div>
  );
};

export default ListingsPage;

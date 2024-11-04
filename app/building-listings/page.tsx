import BuildingListingsComponent from "@/components/BuildingListingsComponent";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Explore a diverse range of property listings at Tigerkenn Homes. Discover your ideal home or investment opportunity with detailed property information, images, and pricing tailored to your needs.",
};

const BuildingListingsPage: React.FC = () => {
  return (
    <div>
      <BuildingListingsComponent />
    </div>
  );
};

export default BuildingListingsPage;

import TopicsComponent from "@/components/TopicsComponent"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threads: Listings & Expert Technical Discussions",
  description:
    "Explore property listings and join insightful technical discussions.",
};

const TopicsPage = () => {
  return (
   <TopicsComponent />
  )
}

export default TopicsPage
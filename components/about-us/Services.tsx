"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    img: "/gifs/home.gif",
    title: "Residential & Commercial Construction",
    description:
      "From custom homes to comprehensive commercial projects, we bring your vision to life with quality and precision.",
  },
  {
    img: "/gifs/ruler.gif",
    title: "Architecture, Design & Consultancy",
    description:
      "Expert design and consultancy services to guide your projects with innovative ideas and professional planning.",
  },
  {
    img: "/gifs/construction.gif",
    title: "Estate Construction & Management",
    description:
      "End-to-end estate development and management to create thriving communities with exceptional standards.",
  },
  {
    img: "/gifs/management.gif",
    title: "Property Management & Investment",
    description:
      "Professional property management services to protect and grow your investments seamlessly.",
  },
];

export function Services() {
  return (
    <section className='py-16 md:py-24'>
      <div className='w-full max-w-7xl mx-auto'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Our Services</h2>
          <p className='mx-auto max-w-2xl text-muted-foreground'>
            We offer a comprehensive range of services to meet all your real
            estate and construction needs.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {services.map(({ img, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card className='h-full'>
                <CardHeader>
                  <Image
                    alt=''
                    width={50}
                    height={50}
                    src={img}
                    className='dark:invert'
                  />
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

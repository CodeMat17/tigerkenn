'use client'

import { motion } from "framer-motion";
import Image from "next/image";

const missionPoints = [
  "Deliver outstanding quality in every project",
  "Foster lasting relationships with our clients",
  "Embrace sustainable building practices",
  "Contribute positively to our communities",
];

const Mission = () => {
  return (
    <section className='bg-muted py-16 md:py-24'>
      <div className='w-full max-w-6xl mx-auto'>
        <div className='grid gap-12 md:grid-cols-2 items-center'>
          {/* Mission Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            <h2 className='mb-4 text-3xl font-bold'>Our Mission</h2>
            <p className='mb-6 text-muted-foreground'>
              To provide exceptional real estate and construction services that
              exceed our clients&apos; expectations, while maintaining the highest
              standards of quality, integrity, and innovation in everything we
              do.
            </p>
            <ul className='space-y-4'>
              {missionPoints.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className='flex items-center'>
                  <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm text-primary-foreground'>
                    ✓
                  </span>
                  {point}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mission Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='relative h-[400px] overflow-hidden rounded-xl'>
            <Image
              src='/svg/mission.svg'
              alt='Our Mission'
              fill
              className='object-cover'
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Mission;

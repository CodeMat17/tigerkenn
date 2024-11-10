"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const useCountUp = (
  endValue: number,
  duration: number,
  startCounting: boolean
) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startCounting) return; // Only start counting when triggered

    let start = 0;
    const increment = endValue / (duration * 60); // Assuming 60 frames per second
    const count = () => {
      start += increment;
      if (start >= endValue) {
        setValue(endValue);
        return;
      }
      setValue(Math.round(start));
      requestAnimationFrame(count);
    };

    count();
  }, [endValue, duration, startCounting]);

  return value;
};

const StatsSection = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  // Control whether each counter should start counting
  const [startCount1, setStartCount1] = useState(false);
  const [startCount2, setStartCount2] = useState(false);
  const [startCount3, setStartCount3] = useState(false);

  // Custom count-up hooks for each number
  const count1 = useCountUp(13, 3, startCount1);
  const count2 = useCountUp(50, 3, startCount2);
  const count3 = useCountUp(5, 3, startCount3);

  useEffect(() => {
    if (inView) {
      // Animate first div and start counting
      controls1.start({ opacity: 1, y: 0 });
      setStartCount1(true);

      // Sequence animations for next divs and start their counters
      setTimeout(() => {
        controls2.start({ opacity: 1, y: 0 });
        setStartCount2(true);
      }, 3000);

      setTimeout(() => {
        controls3.start({ opacity: 1, y: 0 });
        setStartCount3(true);
      }, 6000);
    }
  }, [inView, controls1, controls2, controls3]);

  return (
    <div ref={ref} className='flex items-center justify-around gap-8 mt-6'>
      {/* First Statistic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls1}
        transition={{ type: "spring", stiffness: 100 }}>
        <p className='text-4xl font-bold text-center'>{count1}+</p>
        <p className='text-center'>Years of Excellence</p>
      </motion.div>

      {/* Second Statistic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls2}
        transition={{ type: "spring", stiffness: 100 }}>
        <p className='text-4xl font-bold text-center'>{count2}+</p>
        <p className='text-center'>Completed Projects</p>
      </motion.div>

      {/* Third Statistic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls3}
        transition={{ type: "spring", stiffness: 100 }}>
        <p className='text-4xl font-bold text-center'>{count3}+</p>
        <p className='text-center'>Ongoing Projects</p>
      </motion.div>
    </div>
  );
};

export default StatsSection;

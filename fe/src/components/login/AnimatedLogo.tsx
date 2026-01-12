'use client';

import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export default function AnimatedLogo() {
  const frontPig = useAnimation(); // 이동(앞)
  const backPig = useAnimation(); // 안착(뒤)

  useEffect(() => {
    const run = async () => {
      await backPig.set({ opacity: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 });

      // 바운스 이동
      await frontPig.start({
        x: [360, 320, 285, 250, 215, 180, 145, 110, 75, 40, 20, 0],
        y: [0, -12, 0, -11, 0, -10, 0, -9, 0, -7, 0, -6],
        scaleX: [1, 1.03, 0.99, 1.03, 1, 1.02, 1, 1.02, 1, 1.01, 1, 1],
        scaleY: [1, 0.97, 1.04, 0.98, 1.02, 0.99, 1.02, 0.99, 1.01, 1, 1, 1],
        opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        transition: { duration: 1.85, ease: [0.22, 1, 0.36, 1] },
      });

      // 점프(뒤로 들어가기)
      await frontPig.start({
        x: 0,
        y: [0, -42, -68],
        scaleX: [1, 0.98, 1.02],
        scaleY: [1, 1.06, 0.98],
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      });

      // 앞→뒤 전환 + 뒤에서 바운스 안착
      await Promise.all([
        frontPig.start({ opacity: 0, transition: { duration: 0.08 } }),
        backPig.start({
          opacity: 1,
          y: [-20, 0, -8, 0],
          scaleX: [1, 1.03, 0.99, 1],
          scaleY: [1, 0.97, 1.04, 1],
          transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        }),
      ]);
    };

    run();
  }, [frontPig, backPig]);

  return (
    <div className="relative h-57 w-107 select-none">
      {/* text */}
      <div className="absolute top-[60%] left-1/2 z-20 origin-center -translate-x-1/2 -translate-y-1/2 scale-[1.35]">
        <Image
          src="/logo_text.svg"
          alt="SPENNY"
          width={304}
          height={225}
          priority
        />
      </div>

      {/* pig (behind) */}
      <motion.div
        className="absolute top-[32%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={backPig}
      >
        <Image
          src="/logo_pig.svg"
          alt="Pig"
          width={200}
          height={200}
          priority
        />
      </motion.div>

      {/* pig (front) */}
      <motion.div
        className="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
        initial={{ x: 360, y: 0, opacity: 0 }}
        animate={frontPig}
      >
        <Image
          src="/logo_pig.svg"
          alt="Pig"
          width={170}
          height={170}
          priority
        />
      </motion.div>
    </div>
  );
}

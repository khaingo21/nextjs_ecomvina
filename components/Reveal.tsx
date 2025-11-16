import React from "react";
import { motion, MotionProps } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  once?: boolean;
  y?: number;
} & MotionProps;

export default function Reveal({ children, duration = 0.8, delay = 0, once = true, y = 30, ...rest }: RevealProps) {
  const variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={variants}
      transition={{ duration, delay, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
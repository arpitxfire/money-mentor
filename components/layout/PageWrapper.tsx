"use client";

import { motion } from "framer-motion";
import TopBar from "./TopBar";

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function PageWrapper({ children, title, subtitle }: PageWrapperProps) {
  return (
    <div className="flex-1 min-h-screen bg-navy-950">
      <TopBar title={title} subtitle={subtitle} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="p-6 pb-24 md:pb-6"
      >
        {children}
      </motion.div>
    </div>
  );
}

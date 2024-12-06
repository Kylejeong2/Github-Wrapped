"use client";

import { motion } from "framer-motion";
import { FaStar, FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  const handleStarClick = () => {
    window.open("https://github.com/Kylejeong2/Github-Wrapped", "_blank");
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg mx-auto"
      >
        <div className="flex justify-center mb-6">
          <FaStar className="text-6xl text-yellow-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Star Required!</h1>
        <p className="text-gray-300 mb-8">
          Please star our GitHub repository to use GitHub Wrapped. This helps support the project and keeps it free for everyone!
        </p>
        <div className="space-y-4">
          <button
            onClick={handleStarClick}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition w-full"
          >
            <FaGithub className="text-xl" />
            Star Repository & Try Again
          </button>
        </div>
      </motion.div>
    </main>
  );
} 
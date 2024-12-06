"use client";

import { motion } from "framer-motion";
import { FaGithub, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import Script from "next/script";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    router.push(`/wrapped/${username}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            GitHub Wrapped 2024
          </h1>
          <p className="text-xl mb-4 text-gray-300">
            Discover your GitHub story of 2024 - your commits, contributions, and coding journey
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative w-12 h-12">
              <Image
                src="https://avatars.githubusercontent.com/kylejeong2"
                alt="Kyle Jeong"
                fill
                className="rounded-full border-2 border-purple-500 object-cover"
              />
            </div>
            <div className="text-left">
              <div className="font-semibold">Created by Kyle Jeong</div>
              <div className="flex items-center gap-2">
                <a
                  href="https://twitter.com/kylejeong21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-purple-400 hover:text-purple-300 text-lg transition-all"
                >
                  @kylejeong21
                </a>
                <span className="text-lg text-gray-300">👈 <strong className="text-xl">Please follow to support!</strong></span>
              </div>
            </div>
          </div>

          <Script async src="https://platform.twitter.com/widgets.js" />
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-purple-500/20">
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
            <FaStar className="text-2xl" />
            <span className="text-lg font-semibold">Required: Star the Repository</span>
            <FaStar className="text-2xl" />
          </div>
          <p className="text-gray-300 mb-4">
            To use GitHub Wrapped, you must first star our repository. This helps support the project!
          </p>
          <a
            href="https://github.com/Kylejeong2/Github-Wrapped"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-lg transition-colors"
          >
            <FaGithub className="text-xl" />
            Star Repository
          </a>
        </div>
        
        <div className="space-y-6">
          <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Enter your GitHub username"
              className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
              required
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              <FaGithub className="text-xl" />
              Generate My Wrapped
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}

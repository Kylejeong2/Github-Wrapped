"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaCode, FaFire, FaTrophy, FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import GitHubCalendar from 'react-github-calendar';
import Image from "next/image";

export const runtime = 'edge';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function WrappedPage({ params }: { params: { username: string } }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: params.username }),
    })
      .then((res) => res.json())
      .then((data: any) => {
        if (data.error === "NOT_STARRED") {
          router.push("/wrapped/error");
        } else if (data.error) {
          setError(data.error);
        } else {
          setData(data);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.username, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  const grindingMonthName = monthNames[parseInt(data.stats.grindingMonth) - 1];
  const randomMonthName = monthNames[parseInt(data.stats.randomMonthAnalysis.month) - 1];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {data.profile.name}&apos;s GitHub Wrapped 2024
          </h1>
          <p className="text-base text-gray-300">Your year in code</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src={data.profile.avatar_url}
                  alt={data.profile.login}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">{data.profile.name}</h2>
                <p className="text-gray-400">@{data.profile.login}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<FaCode />}
                label="Repos"
                value={data.stats.totalRepos}
              />
              <StatCard
                icon={<FaStar />}
                label="Stars"
                value={data.stats.totalStars}
              />
              <StatCard
                icon={<FaFire />}
                label="Commits"
                value={data.stats.totalCommits}
              />
              <StatCard
                icon={<FaTrophy />}
                label="Streak"
                value={`${data.stats.longestStreak}d`}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-4"
          >
            <h3 className="text-lg font-bold mb-3">Top Languages</h3>
            <div className="space-y-3">
              {data.stats.topLanguages.map(([lang, count]: [string, number], index: number) => (
                <div key={lang} className="relative">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{lang}</span>
                    <span>{count} repos</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / data.stats.totalRepos) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-bold mb-3">Contribution Graph</h3>
            <GitHubCalendar 
              username={params.username} 
              colorScheme='dark'
              fontSize={12}
            />
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-bold mb-3">Recent Repositories</h3>
            <div className="grid grid-cols-2 gap-2">
              {data.stats.recentRepos.slice(0, 4).map((repo: any) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 rounded-lg p-2 hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{repo.name}</h4>
                    <FaExternalLinkAlt className="text-xs text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      {repo.stars}
                    </span>
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <FaCode />
                        {repo.language}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800 rounded-xl p-4 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-bold mb-3">Pull Request Activity</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-purple-400 text-sm mb-1">Total PRs</div>
                  <div className="text-2xl font-bold">{data.stats.pullRequests.created}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {data.stats.pullRequests.stats.mergedPRs} merged
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-purple-400 text-sm mb-1">Reviews</div>
                  <div className="text-2xl font-bold">{data.stats.pullRequests.reviewed}</div>
                  <div className="text-xs text-gray-400 mt-1">Code reviewed</div>
                </div>
              </div>
              <div className="mt-3 bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-400">PR Stats</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      Total Changes
                    </span>
                    <span className="text-sm font-semibold">{data.stats.pullRequests.stats.totalChanges.toLocaleString()} lines</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Avg Changes/PR
                    </span>
                    <span className="text-sm font-semibold">{data.stats.pullRequests.stats.averageChangesPerPR.toLocaleString()} lines</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Recent Pull Requests</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {data.stats.pullRequests.recentPRs.map((pr: any, i: number) => (
                  <a 
                    key={i} 
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-700 rounded-lg p-2 text-sm hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate flex-1">{pr.title}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                        pr.merged 
                          ? 'bg-purple-500/20 text-purple-300'
                          : pr.state === 'open'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {pr.merged ? 'merged' : pr.state}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs mt-1 flex items-center justify-between">
                      <span>{pr.repo}</span>
                      <span>{new Date(pr.date).toLocaleDateString()}</span>
                    </div>
                    {(pr.additions || pr.deletions) && (
                      <div className="text-gray-400 text-xs mt-1">
                        +{pr.additions} -{pr.deletions} lines
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800 rounded-xl p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-bold mb-3">Monthly Highlights</h3>
              <div className="bg-gray-700 rounded-lg p-3 mb-3">
                <div className="text-purple-400 font-semibold mb-1">🔥 Grinding Month</div>
                <div className="text-xl font-bold">{grindingMonthName}</div>
                <div className="text-sm text-gray-300">
                  {data.stats.monthlyCommits[data.stats.grindingMonth]} commits
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-purple-400 font-semibold mb-1">
                  ✨ {randomMonthName} Vibes
                </div>
                <div className="space-y-1">
                  {data.stats.randomMonthAnalysis.words.map((word: string, i: number) => (
                    <div key={i} className="text-sm">
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">AI Analysis</h3>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="prose prose-invert max-w-none text-sm">
                  {data.stats.aiAnalysis
                    .split("[ANALYSIS]")[1]
                    .split("[MONTH_ANALYSIS]")[0]
                    .split("•")
                    .filter(Boolean)
                    .map((observation: string, i: number) => (
                      <div key={i} className="mb-2 p-2 border-b border-gray-600 last:border-b-0">
                        {observation.trim()}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-gray-700 rounded-lg p-2">
      <div className="flex items-center gap-1.5 text-purple-400 text-sm mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
} 
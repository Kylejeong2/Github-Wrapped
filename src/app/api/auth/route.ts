import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { Octokit } from "@octokit/rest";
import { GraphQLResponse, UserStats } from "@/lib/interfaces/interfaces";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';


const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAIAnalysis(userData: { stats: UserStats }) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthlyCommits = userData.stats.monthlyCommits;
  const grindingMonth = userData.stats.grindingMonth;
  
  // Pick a random month that's not the grinding month
  const availableMonths = Object.entries(monthlyCommits)
    .filter(([month]) => month !== grindingMonth && monthlyCommits[month] > 0)
    .map(([month]) => month);
  const randomMonth = availableMonths[Math.floor(Math.random() * availableMonths.length)];

  const prompt = `As a witty developer advocate, create 2 short, impactful observations about this GitHub user's coding activity. Be creative and fun!
  Here's their data for 2024:
  - Total Repos: ${userData.stats.totalRepos}
  - Total Stars: ${userData.stats.totalStars}
  - Top Languages: ${userData.stats.topLanguages.map(([lang, count]) => `${lang} (${count} repos)`).join(', ')}
  - Total Commits: ${userData.stats.totalCommits}
  - Most Active Repository: ${userData.stats.mostActiveRepo}
  - Longest Streak: ${userData.stats.longestStreak} days
  - Grinding Month (${monthNames[parseInt(grindingMonth!) - 1]}): ${monthlyCommits[grindingMonth!]} commits
  
  Also, describe their coding style in ${monthNames[parseInt(randomMonth) - 1]} with exactly 3 powerful, single-word adjectives.
  
  Format the response like this:
  [ANALYSIS]
  • First witty observation with an emoji
  • Second witty observation with an emoji
  
  [MONTH_ANALYSIS]
  WORD1
  WORD2
  WORD3`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 250,
  });

  return {
    analysis: response.choices[0].message.content,
    randomMonth,
  };
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json() as { username: string };

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Check if user exists and has starred the repo
    const [userResponse, starredResponse] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.activity.checkRepoIsStarredByAuthenticatedUser({
        owner: "Kylejeong2",
        repo: "Github-Wrapped",
        username,
      }).catch(() => ({ status: 404 })),
    ]);

    if (starredResponse.status === 404) {
      return NextResponse.json(
        { error: "NOT_STARRED" },
        { status: 403 }
      );
    }

    // Get user's contribution data using GraphQL
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
            pullRequestContributions(first: 100) {
              totalCount
              nodes {
                pullRequest {
                  title
                  state
                  createdAt
                  repository {
                    name
                  }
                }
              }
            }
            pullRequestReviewContributions(first: 100) {
              totalCount
              nodes {
                pullRequest {
                  title
                  state
                  repository {
                    name
                  }
                }
              }
            }
          }
          repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              description
              url
              stargazerCount
              primaryLanguage {
                name
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 1) {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const graphqlResponse = await octokit.graphql(query, { username }) as GraphQLResponse;
    const userData = graphqlResponse.user;

    // Process contribution data
    const contributionDays = userData.contributionsCollection.contributionCalendar.weeks
      .flatMap((week: any) => week.contributionDays)
      .filter((day: any) => new Date(day.date) >= new Date('2024-01-01'));

    const monthlyCommits: { [key: string]: number } = {};
    contributionDays.forEach((day: any) => {
      const month = new Date(day.date).getMonth() + 1;
      const monthKey = month.toString().padStart(2, '0');
      monthlyCommits[monthKey] = (monthlyCommits[monthKey] || 0) + day.contributionCount;
    });

    // Find the grinding month
    const grindingMonth = Object.entries(monthlyCommits)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    // Process the data
    const processedData = {
      profile: userResponse.data,
      stats: {
        totalRepos: userData.repositories.nodes.length,
        totalStars: userData.repositories.nodes.reduce((acc: number, repo: any) => acc + repo.stargazerCount, 0),
        topLanguages: processTopLanguages(userData.repositories.nodes),
        commitActivity: Object.fromEntries(
          contributionDays.map((day: any) => [day.date, day.contributionCount])
        ),
        totalCommits: userData.contributionsCollection.contributionCalendar.totalContributions,
        mostActiveRepo: getMostActiveRepo(userData.repositories.nodes),
        longestStreak: calculateStreak(contributionDays),
        currentStreak: calculateCurrentStreak(contributionDays),
        pullRequests: {
          created: userData.contributionsCollection.pullRequestContributions.totalCount,
          reviewed: userData.contributionsCollection.pullRequestReviewContributions.totalCount,
          recentPRs: userData.contributionsCollection.pullRequestContributions.nodes
            .filter((node: any) => new Date(node.pullRequest.createdAt) >= new Date('2024-01-01'))
            .map((node: any) => ({
              title: node.pullRequest.title,
              state: node.pullRequest.state,
              repo: node.pullRequest.repository.name,
              date: new Date(node.pullRequest.createdAt).toISOString().split('T')[0],
            }))
            .slice(0, 5),
        },
        recentRepos: userData.repositories.nodes.slice(0, 6).map((repo: any) => ({
          name: repo.name,
          stars: repo.stargazerCount,
          language: repo.primaryLanguage?.name,
          description: repo.description,
          url: repo.url,
        })),
        monthlyCommits,
        grindingMonth,
      } as UserStats,
    };

    // Generate AI analysis
    const aiResult = await generateAIAnalysis(processedData);
    processedData.stats.aiAnalysis = aiResult.analysis || "";
    processedData.stats.randomMonthAnalysis = {
      month: aiResult.randomMonth,
      words: aiResult.analysis?.split('[MONTH_ANALYSIS]')[1]
        ?.trim()
        ?.split('\n')
        ?.filter(Boolean)
        ?.map(w => w.trim()) || [],
    };

    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

function processTopLanguages(repos: any[]): [string, number][] {
  const languages = repos.reduce((acc: { [key: string]: number }, repo: any) => {
    if (repo.primaryLanguage?.name) {
      acc[repo.primaryLanguage.name] = (acc[repo.primaryLanguage.name] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
}

function getMostActiveRepo(repos: any[]): string {
  return repos.reduce((max: any, repo: any) => {
    const commits = repo.defaultBranchRef?.target?.history?.totalCount || 0;
    return commits > (max.commits || 0) ? { name: repo.name, commits } : max;
  }, {}).name || "N/A";
}

function calculateStreak(days: any[]): number {
  let currentStreak = 0;
  let maxStreak = 0;

  for (let i = 0; i < days.length; i++) {
    if (days[i].contributionCount > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

function calculateCurrentStreak(days: any[]): number {
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].date === today && days[i].contributionCount === 0) break;
    if (days[i].contributionCount > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
} 
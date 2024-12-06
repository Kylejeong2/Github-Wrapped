export interface UserStats {
    totalRepos: number;
    totalStars: number;
    topLanguages: [string, number][];
    commitActivity: { [key: string]: number };
    totalCommits: number;
    mostActiveRepo: string;
    longestStreak: number;
    currentStreak: number;
    recentRepos: any[];
    monthlyCommits: { [key: string]: number };
    aiAnalysis?: string;
    grindingMonth?: string;
    randomMonthAnalysis?: {
      month: string;
      words: string[];
    };
    pullRequests: {
      created: number;
      reviewed: number;
      merged: number;
      declined: number;
      pending: number;
      total: number;
      recentPRs: Array<{
        title: string;
        state: string;
        repo: string;
        date: string;
      }>;
    };
  }

export interface GraphQLResponse {
  user: {
    contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              contributionCount: number;
              date: string;
            }[];
          }[];
        };
        pullRequestContributions: {
          totalCount: number;
          nodes: Array<{
            pullRequest: {
              title: string;
              state: string;
              createdAt: string;
              repository: { name: string };
            };
          }>;
        };
        pullRequestReviewContributions: {
          totalCount: number;
          nodes: Array<{
            pullRequest: {
              title: string;
              state: string;
              repository: { name: string };
            };
          }>;
        };
      };
      repositories: {
        nodes: any[];
      };
    };
  }
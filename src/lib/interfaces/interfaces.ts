export interface PullRequest {
  title: string;
  state: string;
  repo: string;
  date: string;
  url: string;
  merged: boolean;
  additions?: number;
  deletions?: number;
}

export interface PRStats {
  totalChanges: number;
  mergedPRs: number;
  averageChangesPerPR: number;
}

export interface UserStats {
  totalRepos: number;
  totalStars: number;
  topLanguages: [string, number][];
  commitActivity: { [key: string]: number };
  totalCommits: number;
  mostActiveRepo: string;
  longestStreak: number;
  currentStreak: number;
  pullRequests: {
    created: number;
    reviewed: number;
    recentPRs: PullRequest[];
    recentReviews: PullRequest[];
    stats: PRStats;
  };
  recentRepos: {
    name: string;
    stars: number;
    language: string | null;
    description: string | null;
    url: string;
  }[];
  monthlyCommits: { [key: string]: number };
  grindingMonth: string;
  aiAnalysis?: string;
  randomMonthAnalysis?: {
    month: string;
    words: string[];
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
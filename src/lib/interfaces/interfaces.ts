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
      };
      repositories: {
        nodes: any[];
      };
    };
  }
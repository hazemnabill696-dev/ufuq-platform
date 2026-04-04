export type UserRole = "student" | "parent" | "teacher";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  age: number | null;
  grade: number | null;
  parent_id: string | null;
  created_at: string;
}

export interface SubjectProgress {
  id: string;
  user_id: string;
  subject_id: string;
  points: number;
  level: number;
  activities_completed: number;
  last_activity: string | null;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface ActivityLogEntry {
  id: string;
  user_id: string;
  subject_id: string;
  points_earned: number;
  activity_type: string;
  completed_at: string;
}

export interface SubjectDefinition {
  id: string;
  nameAr: string;
  icon: string;
  color: string;
  bgLight: string;
  description: string;
  educationalGoal: string;
}

export interface LevelInfo {
  current: number;
  title: string;
  nextLevelPoints: number;
  progressPercent: number;
}

export interface AchievementDefinition {
  id: string;
  icon: string;
  titleAr: string;
  descriptionAr: string;
}

export interface Achievement extends AchievementDefinition {
  unlocked: boolean;
  earnedAt?: string;
  recentlyEarned?: boolean;
}

export interface GamificationEngine {
  addPoints(userId: string, subject: string, amount: number): void;
  getPoints(userId: string): number;
  calculateLevel(points: number): LevelInfo;
  checkAchievements(userId: string): Achievement[];
  updateStreak(userId: string): number;
}

"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

type ExperienceLevel = "Explorer" | "Connector" | "Mentor";

type ImpactWalletTransaction = {
  id: string;
  type: "action" | "badge" | "task" | "reminder";
  description: string;
  pointsChange?: number;
  hoursChange?: number;
  createdAt: string;
  relatedActionId?: string;
  category?: UserContributionCategory;
};

type ImpactTask = {
  id: string;
  title: string;
  description: string;
  cadence: "once" | "weekly" | "monthly";
  points: number;
  hours?: number;
  completed: boolean;
  lastCompletedAt?: string | null;
};

type ImpactWalletState = {
  points: number;
  volunteeringHours: number;
  badges: string[];
  transactions: ImpactWalletTransaction[];
  tasks: ImpactTask[];
};

type SkillPassportEntry = {
  id: string;
  title: string;
  category: string;
  earnedAt: string;
  source: "event" | "group" | "course" | "volunteer" | "story" | "system";
  details?: string;
};

type PathwayNode = {
  id: string;
  title: string;
  description: string;
  status: "up-next" | "in-progress" | "done";
  xpReward: number;
  area: "jobs" | "study" | "volunteering" | "community" | "language" | "admin";
};

type Reminder = {
  id: string;
  title: string;
  dueAt: string;
  channel: "email" | "sms" | "in-app";
  relatedActionId?: string;
};

type SafetyState = {
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  gdprConsent: boolean;
  moderationEnabled: boolean;
  lastReviewAt: string;
};

type UserContributionCategory =
  | "events"
  | "groups"
  | "resources"
  | "learning"
  | "volunteer"
  | "buddy"
  | "tools"
  | "voice"
  | "safety"
  | "admin"
  | "story";

type ContributionPayload = {
  id: string;
  label: string;
  category: UserContributionCategory;
  xp?: number;
  impactPoints?: number;
  impactHours?: number;
  badgeId?: string;
  badgeLabel?: string;
  skill?: {
    id: string;
    title: string;
    category: string;
    details?: string;
    source?: SkillPassportEntry["source"];
  };
  pathwayNodeId?: string;
  reminder?: {
    title: string;
    dueAt: string;
    channel: Reminder["channel"];
  };
  taskId?: string;
  metadata?: Record<string, string | number | boolean>;
};

type UserProfileState = {
  name: string;
  level: ExperienceLevel;
  xp: number;
  previousLevelXp: number;
  nextLevelXp: number | null;
  progressPercent: number;
  peopleHelpedThisWeek: number;
  contributionsThisMonth: number;
  mentorsUnlocked: number;
  motivationalMessage: string;
  goals: string[];
  impactWallet: ImpactWalletState;
  skillPassport: {
    entries: SkillPassportEntry[];
    lastUpdatedAt: string;
  };
  pathway: {
    currentStage: ExperienceLevel;
    nodes: PathwayNode[];
    completedActionIds: string[];
  };
  safety: SafetyState;
  settings: {
    plainLanguage: boolean;
    audioAssist: boolean;
  };
  reminders: Reminder[];
  actionHistory: Record<
    string,
    {
      id: string;
      label: string;
      category: UserContributionCategory;
      xp: number;
      impactPoints: number;
      impactHours: number;
      createdAt: string;
    }
  >;
};

type UserProfileAction =
  | { type: "RECORD_ACTION"; payload: ContributionPayload }
  | { type: "TOGGLE_PLAIN_LANGUAGE" }
  | { type: "TOGGLE_AUDIO_ASSIST" }
  | { type: "MARK_VERIFIED"; payload: Partial<SafetyState> }
  | { type: "UPDATE_GOALS"; payload: string[] }
  | { type: "RESET_WEEKLY_METRICS" };

type UserProfileContextValue = {
  state: UserProfileState;
  recordAction: (payload: ContributionPayload) => void;
  togglePlainLanguage: () => void;
  toggleAudioAssist: () => void;
  markVerified: (payload: Partial<SafetyState>) => void;
  updateGoals: (goals: string[]) => void;
};

const LEVEL_THRESHOLDS: Array<{
  level: ExperienceLevel;
  minXp: number;
  nextLevelXp: number | null;
}> = [
  { level: "Explorer", minXp: 0, nextLevelXp: 300 },
  { level: "Connector", minXp: 300, nextLevelXp: 700 },
  { level: "Mentor", minXp: 700, nextLevelXp: null },
];

const defaultMotivation = "You helped 2 people this week — great work!";

const INITIAL_STATE: UserProfileState = {
  name: "Amina",
  level: "Explorer",
  xp: 180,
  previousLevelXp: 0,
  nextLevelXp: 300,
  progressPercent: Math.round((180 / 300) * 100),
  peopleHelpedThisWeek: 2,
  contributionsThisMonth: 5,
  mentorsUnlocked: 1,
  motivationalMessage: defaultMotivation,
  goals: ["Find a hospitality job", "Reach Finnish level A2", "Meet local mentors"],
  impactWallet: {
    points: 320,
    volunteeringHours: 12,
    badges: ["Welcome Guide"],
    transactions: [
      {
        id: "txn-initial-1",
        type: "action",
        description: "Joined Kajaani Integration Circle",
        pointsChange: 40,
        hoursChange: 2,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        relatedActionId: "group-1",
        category: "groups",
      },
    ],
    tasks: [
      {
        id: "task-welcome-message",
        title: "Welcome a newcomer in chat",
        description: "Send a friendly message to a new member in any group you follow.",
        cadence: "weekly",
        points: 15,
        hours: 0.2,
        completed: false,
        lastCompletedAt: null,
      },
      {
        id: "task-event-share",
        title: "Share an upcoming event",
        description: "Recommend an event to your buddy or peer circle.",
        cadence: "weekly",
        points: 20,
        hours: 0.1,
        completed: false,
        lastCompletedAt: null,
      },
      {
        id: "task-finnish-practice",
        title: "Practice Finnish for 15 minutes",
        description: "Use the AI Language Buddy or a real mentor to practice.",
        cadence: "daily",
        points: 10,
        hours: 0.25,
        completed: false,
        lastCompletedAt: null,
      },
    ],
  },
  skillPassport: {
    entries: [
      {
        id: "skill-finnish-a1",
        title: "Finnish A1 Basic Conversation",
        category: "Language",
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        source: "course",
        details: "Completed 5 AI Language Buddy sessions",
      },
      {
        id: "skill-community-helper",
        title: "Community Helper Hours",
        category: "Volunteering",
        earnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        source: "volunteer",
        details: "Logged 10 hours in micro-volunteering board",
      },
    ],
    lastUpdatedAt: new Date().toISOString(),
  },
  pathway: {
    currentStage: "Explorer",
    nodes: [
      {
        id: "path-event-1",
        title: "Attend a Finnish Language Café",
        description: "Meet locals and practice key phrases.",
        status: "done",
        xpReward: 40,
        area: "language",
      },
      {
        id: "path-admin-1",
        title: "Complete DVV registration",
        description: "Register your address and receive ID number.",
        status: "done",
        xpReward: 60,
        area: "admin",
      },
      {
        id: "path-job-1",
        title: "Update CV with volunteer experience",
        description: "Showcase your community impact.",
        status: "in-progress",
        xpReward: 50,
        area: "jobs",
      },
      {
        id: "path-volunteer-1",
        title: "Complete a micro-volunteering task",
        description: "Support another newcomer for 30 minutes.",
        status: "up-next",
        xpReward: 35,
        area: "volunteering",
      },
      {
        id: "path-community-1",
        title: "Host a peer circle check-in",
        description: "Lead a short check-in with your Peer Circle.",
        status: "up-next",
        xpReward: 45,
        area: "community",
      },
    ],
    completedActionIds: ["group-1", "event-1"],
  },
  safety: {
    verifiedEmail: true,
    verifiedPhone: true,
    gdprConsent: true,
    moderationEnabled: true,
    lastReviewAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  settings: {
    plainLanguage: false,
    audioAssist: false,
  },
  reminders: [],
  actionHistory: {},
};

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

function deriveLevel(xp: number) {
  const levelConfig = [...LEVEL_THRESHOLDS].reverse().find((config) => xp >= config.minXp) ?? LEVEL_THRESHOLDS[0];
  const previousLevelXp = levelConfig.minXp;
  const nextLevelXp = levelConfig.nextLevelXp;
  const progressPercent =
    nextLevelXp === null
      ? 100
      : Math.max(0, Math.min(100, Math.round(((xp - previousLevelXp) / (nextLevelXp - previousLevelXp)) * 100)));

  return {
    level: levelConfig.level,
    previousLevelXp,
    nextLevelXp,
    progressPercent,
  };
}

function ensureUniqueSkill(entries: SkillPassportEntry[], newEntry: SkillPassportEntry) {
  const exists = entries.some((entry) => entry.id === newEntry.id);
  if (exists) {
    return entries.map((entry) =>
      entry.id === newEntry.id ? { ...entry, earnedAt: newEntry.earnedAt, details: newEntry.details ?? entry.details } : entry,
    );
  }
  return [newEntry, ...entries].slice(0, 25);
}

function updateTaskState(tasks: ImpactTask[], payload: ContributionPayload, timestamp: string) {
  if (!payload.taskId) return tasks;
  return tasks.map((task) => {
    if (task.id !== payload.taskId) return task;
    return {
      ...task,
      completed: true,
      lastCompletedAt: timestamp,
    };
  });
}

function buildMotivationalMessage(state: UserProfileState, xpGain: number, pointsGain: number) {
  if (xpGain > 0 && state.nextLevelXp && state.xp + xpGain >= state.nextLevelXp) {
    return "🚀 Connector milestone unlocked! Keep the momentum going.";
  }
  if (pointsGain >= 40) {
    return "🌟 Major impact! Thanks for powering your community.";
  }
  if (state.peopleHelpedThisWeek >= 3) {
    return "🤝 You're becoming a go-to connector. Thank you!";
  }
  return defaultMotivation;
}

function userProfileReducer(state: UserProfileState, action: UserProfileAction): UserProfileState {
  switch (action.type) {
    case "RECORD_ACTION": {
      const payload = action.payload;
      const existing = state.actionHistory[payload.id];
      const timestamp = new Date().toISOString();

      const xpGain = payload.xp ?? 25;
      const impactPointsGain = payload.impactPoints ?? xpGain;
      const impactHoursGain = payload.impactHours ?? 0;

      const newXp = existing ? state.xp : state.xp + xpGain;
      const levelDetails = deriveLevel(newXp);

      const updatedHistory = {
        ...state.actionHistory,
        [payload.id]: existing ?? {
          id: payload.id,
          label: payload.label,
          category: payload.category,
          xp: xpGain,
          impactPoints: impactPointsGain,
          impactHours: impactHoursGain,
          createdAt: timestamp,
        },
      };

      const newTransaction: ImpactWalletTransaction | null = existing
        ? null
        : {
            id: `txn-${payload.id}-${timestamp}`,
            type: payload.taskId ? "task" : payload.badgeId ? "badge" : "action",
            description: payload.label,
            pointsChange: impactPointsGain,
            hoursChange: impactHoursGain || undefined,
            createdAt: timestamp,
            relatedActionId: payload.id,
            category: payload.category,
          };

      const updatedTransactions = newTransaction
        ? [newTransaction, ...state.impactWallet.transactions].slice(0, 50)
        : state.impactWallet.transactions;

      const updatedBadges =
        payload.badgeLabel && !state.impactWallet.badges.includes(payload.badgeLabel)
          ? [payload.badgeLabel, ...state.impactWallet.badges]
          : state.impactWallet.badges;

      const skillEntries =
        payload.skill != null
          ? ensureUniqueSkill(state.skillPassport.entries, {
              id: payload.skill.id,
              title: payload.skill.title,
              category: payload.skill.category,
              earnedAt: timestamp,
              source: payload.skill.source ?? "system",
              details: payload.skill.details,
            })
          : state.skillPassport.entries;

      const updatedNodes = state.pathway.nodes.map((node) => {
        if (payload.pathwayNodeId && node.id === payload.pathwayNodeId) {
          return { ...node, status: "done" };
        }
        if (payload.category === "events" && node.area === "community" && node.status === "up-next") {
          return { ...node, status: "in-progress" };
        }
        return node;
      });

      const reminders = payload.reminder
        ? [
            ...state.reminders,
            {
              id: `reminder-${payload.id}`,
              title: payload.reminder.title,
              dueAt: payload.reminder.dueAt,
              channel: payload.reminder.channel,
              relatedActionId: payload.id,
            },
          ]
        : state.reminders;

      const newPeopleHelped =
        payload.category === "buddy" || payload.category === "volunteer" || payload.category === "groups"
          ? state.peopleHelpedThisWeek + (existing ? 0 : 1)
          : state.peopleHelpedThisWeek;

      const newContributions = existing ? state.contributionsThisMonth : state.contributionsThisMonth + 1;
      const newMentorsUnlocked =
        levelDetails.level === "Connector" && state.level !== "Connector"
          ? state.mentorsUnlocked + 1
          : state.mentorsUnlocked;

      const motivationalMessage = existing
        ? state.motivationalMessage
        : buildMotivationalMessage(state, xpGain, impactPointsGain);

      return {
        ...state,
        xp: newXp,
        level: levelDetails.level,
        previousLevelXp: levelDetails.previousLevelXp,
        nextLevelXp: levelDetails.nextLevelXp,
        progressPercent: levelDetails.progressPercent,
        peopleHelpedThisWeek: newPeopleHelped,
        contributionsThisMonth: newContributions,
        mentorsUnlocked: newMentorsUnlocked,
        motivationalMessage,
        impactWallet: {
          points: existing ? state.impactWallet.points : state.impactWallet.points + impactPointsGain,
          volunteeringHours: existing ? state.impactWallet.volunteeringHours : state.impactWallet.volunteeringHours + impactHoursGain,
          badges: updatedBadges,
          transactions: updatedTransactions,
          tasks: updateTaskState(state.impactWallet.tasks, payload, timestamp),
        },
        skillPassport: {
          entries: skillEntries,
          lastUpdatedAt: payload.skill ? timestamp : state.skillPassport.lastUpdatedAt,
        },
        pathway: {
          ...state.pathway,
          currentStage: levelDetails.level,
          nodes: updatedNodes,
          completedActionIds: existing ? state.pathway.completedActionIds : [payload.id, ...state.pathway.completedActionIds],
        },
        reminders,
        actionHistory: updatedHistory,
      };
    }
    case "TOGGLE_PLAIN_LANGUAGE":
      return {
        ...state,
        settings: {
          ...state.settings,
          plainLanguage: !state.settings.plainLanguage,
        },
      };
    case "TOGGLE_AUDIO_ASSIST":
      return {
        ...state,
        settings: {
          ...state.settings,
          audioAssist: !state.settings.audioAssist,
        },
      };
    case "MARK_VERIFIED":
      return {
        ...state,
        safety: {
          ...state.safety,
          ...action.payload,
          lastReviewAt: new Date().toISOString(),
        },
      };
    case "UPDATE_GOALS":
      return {
        ...state,
        goals: action.payload,
        motivationalMessage:
          action.payload.length > 0
            ? `🎯 Next focus: ${action.payload[0]}. Keep taking small steps!`
            : state.motivationalMessage,
      };
    case "RESET_WEEKLY_METRICS":
      return {
        ...state,
        peopleHelpedThisWeek: 0,
        motivationalMessage: defaultMotivation,
        impactWallet: {
          ...state.impactWallet,
          tasks: state.impactWallet.tasks.map((task) => ({
            ...task,
            completed: false,
          })),
        },
      };
    default:
      return state;
  }
}

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userProfileReducer, INITIAL_STATE);

  const recordAction = (payload: ContributionPayload) => dispatch({ type: "RECORD_ACTION", payload });
  const togglePlainLanguage = () => dispatch({ type: "TOGGLE_PLAIN_LANGUAGE" });
  const toggleAudioAssist = () => dispatch({ type: "TOGGLE_AUDIO_ASSIST" });
  const markVerified = (payload: Partial<SafetyState>) => dispatch({ type: "MARK_VERIFIED", payload });
  const updateGoals = (goals: string[]) => dispatch({ type: "UPDATE_GOALS", payload: goals.filter(Boolean) });

  const value = useMemo(
    () => ({
      state,
      recordAction,
      togglePlainLanguage,
      toggleAudioAssist,
      markVerified,
      updateGoals,
    }),
    [state],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}



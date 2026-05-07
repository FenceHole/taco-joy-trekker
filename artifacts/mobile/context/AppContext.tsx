import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type LogEntry = {
  id: string;
  date: string;
  dateTimestamp: number;
  itemId: string;
  itemName: string;
  itemIcon: string;
  modifiers: string[];
  joyPoints: number;
  protein: number;
  fiber: number;
};

type AppContextType = {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, "id" | "dateTimestamp">) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  totalJoy: number;
  totalProtein: number;
  totalFiber: number;
  level: number;
  currentTitle: string;
  levelProgress: number;
  ptsToNextLevel: number;
};

const AppContext = createContext<AppContextType | null>(null);

const LEVEL_NAMES = [
  "Mild Sauce Novice",
  "Hot Sauce Hustler",
  "Fire Sauce Phenom",
  "Diablo Master",
  "Crunchwrap Queen",
];

const STORAGE_KEY = "taco_joy_logs";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setLogs(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  const saveLogs = useCallback(async (newLogs: LogEntry[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    setLogs(newLogs);
  }, []);

  const addLog = useCallback(
    async (entry: Omit<LogEntry, "id" | "dateTimestamp">) => {
      const newEntry: LogEntry = {
        ...entry,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        dateTimestamp: Date.now(),
      };
      const updated = [newEntry, ...logs];
      await saveLogs(updated);
    },
    [logs, saveLogs]
  );

  const deleteLog = useCallback(
    async (id: string) => {
      const updated = logs.filter((l) => l.id !== id);
      await saveLogs(updated);
    },
    [logs, saveLogs]
  );

  const totalJoy = logs.reduce((acc, l) => acc + l.joyPoints, 0);
  const totalProtein = logs.reduce((acc, l) => acc + l.protein, 0);
  const totalFiber = logs.reduce((acc, l) => acc + l.fiber, 0);

  const level = Math.floor(totalJoy / 100) + 1;
  const currentTitle = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  const levelProgress = totalJoy % 100;
  const ptsToNextLevel = 100 - levelProgress;

  return (
    <AppContext.Provider
      value={{
        logs,
        addLog,
        deleteLog,
        totalJoy,
        totalProtein,
        totalFiber,
        level,
        currentTitle,
        levelProgress,
        ptsToNextLevel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

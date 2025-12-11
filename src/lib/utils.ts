import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SessionType } from "@/types/TimerState"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const sessions_until_long_break = 4;

export const getNextSessionType = (currentType: SessionType, sessionCount: number): SessionType => {
    if (currentType === "session") {
        return sessionCount % sessions_until_long_break === 0 ? "longBreak" : "break"
    }
    return "session";
}
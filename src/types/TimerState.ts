export type TimeConfig = {
    session: number;
    break: number;
    longBreak: number;
};

export type SessionType = "session" | "break" | "longBreak";

export type TimerState = {
    sessionCount: number;
    currentType: SessionType;
    remaining: number;
    isRunning: boolean;
    config: TimeConfig;
    editConfig: TimeConfig;
};
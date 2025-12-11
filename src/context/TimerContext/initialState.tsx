import type { TimerState, TimeConfig } from "@/types/TimerState";

const default_config: TimeConfig = {
    session: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60
}

export const initialState: TimerState = {
    sessionCount: 1,
    currentType: "session",
    remaining: default_config.session,
    isRunning: false,
    config: default_config,
    editConfig: default_config
};
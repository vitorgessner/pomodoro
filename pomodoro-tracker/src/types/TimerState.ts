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

export type TimerAction =
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'STOP' }
    | { type: 'TICK' }
    | { type: 'CHANGE_SESSION_TYPE'; payload: SessionType }
    | { type: 'TRANSITION_SESSION' }
    | { type: 'UPDATE_EDIT_CONFIG'; payload: { key: SessionType; value: number } }
    | { type: 'SAVE_CONFIG' };
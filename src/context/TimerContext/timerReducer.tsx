import { getNextSessionType } from "@/lib/utils";
import type { TimerState } from "@/types/TimerState";
import type { TimerAction } from "../TimerContext/timerActions"

export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
    switch (action.type) {
        case 'START':
            if (state.remaining === 0 || state.isRunning) return state;
            return { ...state, isRunning: true };

        case 'PAUSE':
            return { ...state, isRunning: false };

        case 'STOP':
            return {
                ...state,
                isRunning: false,
                remaining: state.config[state.currentType]
            };

        case 'TICK':
            if (!state.isRunning) return state;
            return {
                ...state,
                remaining: Math.max(0, state.remaining - 1)
            };

        case 'CHANGE_SESSION_TYPE': {
            const newType = action.payload;
            return {
                ...state,
                currentType: newType,
                remaining: state.config[newType],
                isRunning: false
            };
        };

        case 'TRANSITION_SESSION': {
            const nextType = getNextSessionType(state.currentType, state.sessionCount);
            const shouldIncrement = state.currentType === "break" || state.currentType === "longBreak";

            return {
                ...state,
                currentType: nextType,
                remaining: state.config[nextType],
                sessionCount: shouldIncrement ? state.sessionCount + 1 : state.sessionCount,
                isRunning: false
            }
        }

        case 'UPDATE_EDIT_CONFIG':
            return {
                ...state,
                editConfig: {
                    ...state.editConfig,
                    [action.payload.key]: action.payload.value
                }
            };

        case 'SAVE_CONFIG':
            return {
                ...state,
                config: state.editConfig,
                remaining: state.editConfig[state.currentType]
            };

        default:
            return state;
    }
}
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { Button } from "../components/Button";
import { CurrentSessionType } from "../components/CurrentSessionType";
import { Timer } from "../components/Timer";
import type { TimeConfig, SessionType, TimerState, TimerAction } from "../types/TimerState";

import soundFile from '../assets/01. I Thought About Killing You.flac'
import { EditModal } from "@/components/EditModal";

const default_config: TimeConfig = {
    session: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60
}

const sessions_until_long_break = 4;
const notification_duration = 3000;

const getNextSessionType = (currentType: SessionType, sessionCount: number): SessionType => {
    if (currentType === "session") {
        return sessionCount % sessions_until_long_break === 0 ? "longBreak" : "break"
    }
    return "session";
}

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
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

const initialState: TimerState = {
    sessionCount: 1,
    currentType: "session",
    remaining: default_config.session,
    isRunning: false,
    config: default_config,
    editConfig: default_config
};

export const MainPage = () => {
    const [state, dispatch] = useReducer(timerReducer, initialState)
    const intervalRef = useRef<number | null>(null);
    const audio = useMemo<HTMLAudioElement>(() => {
        return new Audio(soundFile)
    }, [])

    useEffect(() => {
        return() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, []);

    useEffect(() => {
        if (state.isRunning && !intervalRef.current) {
            intervalRef.current = setInterval(() => {
                dispatch({ type: 'TICK' });
            }, 1000);
        } else if (!state.isRunning && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [state.isRunning])

    useEffect(() => {
        if (state.remaining === 0 && state.currentType) {
            audio.play().catch(console.error);

            const timeoutId = setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                dispatch({ type: 'TRANSITION_SESSION'});
            }, notification_duration)

            return () => clearTimeout(timeoutId);
        }
    }, [state.remaining, state.currentType, audio])

    const startTimer = useCallback(() => {
        dispatch({ type: 'START' });
    }, []);

    const pauseTimer = useCallback(() => {
        dispatch({ type: 'PAUSE' })
    }, [])

    const stopTimer = useCallback(() => {
        dispatch({ type: 'STOP' })
    }, [])

    const handleSessionTypeChange = useCallback((type: SessionType) => {
        dispatch({ type: 'CHANGE_SESSION_TYPE', payload: type });
    }, []);

    return (
        <div className="flex flex-col items-center my-15">
            <EditModal state={state} dispatch={dispatch}/>
            <CurrentSessionType type={state.currentType} count={state.sessionCount} />
            <div className="flex gap-1 flex-start justify-between w-[234px]">
                <Button type="session"
                disabled={state.isRunning} 
                onClick={() => handleSessionTypeChange("session")} 
                />
                <Button type="break"
                disabled={state.isRunning} 
                onClick={() => handleSessionTypeChange("break")} 
                />
                <Button type="longBreak"
                disabled={state.isRunning} 
                onClick={() => handleSessionTypeChange("longBreak")} 
                />
            </div>
            <Timer remaining={state.remaining}
                sessionType={state.currentType}
                handleSessionTypeChange={handleSessionTypeChange} />
            <div className="flex mt-2 m-auto justify-between w-[234px]">
                <span className="flex gap-2">
                    <Button type="start" 
                    disabled={state.isRunning || state.remaining === 0}
                    onClick={startTimer} 
                    />
                    <Button type="pause"
                    disabled={!state.isRunning} 
                    onClick={pauseTimer} 
                    />
                    <Button type="stop"
                    disabled={state.remaining === state.config[state.currentType]} 
                    onClick={stopTimer} 
                    />
                </span>
            </div>
        </div>
    );
}
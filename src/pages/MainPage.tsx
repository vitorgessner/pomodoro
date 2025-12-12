import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { Button } from "../components/Button";
import { CurrentSessionType } from "../components/CurrentSessionType";
import { Timer } from "../components/Timer";
import { EditModal } from "../components/EditModal";
import { ButtonContainer } from "../components/ButtonContainer";

import { TimerContext } from "../context/TimerContext/TimerContext";
import { initialState } from "../context/TimerContext/initialState";
import { timerReducer } from "../context/TimerContext/timerReducer";

import type { SessionType } from "../types/TimerState";

import soundFile from '../assets/01. I Thought About Killing You.flac'

const NOTIFICATION_DURATION = 3000;

export const MainPage = () => {
    const [state, dispatch] = useReducer(timerReducer, initialState)
    const intervalRef = useRef<number | null>(null);
    const audio = useMemo<HTMLAudioElement>(() => {
        return new Audio(soundFile)
    }, [])

    useEffect(() => {
        return () => {
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
                dispatch({ type: 'TRANSITION_SESSION' });
            }, NOTIFICATION_DURATION)

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
        <TimerContext value={state}>
        <div className="flex-center my-15">
            <EditModal dispatch={dispatch} />

            <CurrentSessionType />

            <ButtonContainer>
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
            </ButtonContainer>

            <Timer handleSessionTypeChange={handleSessionTypeChange}/>

            <ButtonContainer>
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
            </ButtonContainer>
        </div>
        </TimerContext>
    );
}
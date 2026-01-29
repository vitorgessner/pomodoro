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

import soundFile from '../assets/timer-terminer-342934.mp3'

const NOTIFICATION_DURATION = 1500;

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

                <div className="flex relative items-center justify-center">
                    <Timer handleSessionTypeChange={handleSessionTypeChange} />
                    <svg width="284" height="237" viewBox="0 0 194 147" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M151.757 139.784C208.257 121.085 203.757 41.6879 156.257 25.1663C132.59 18.6266 93.8568 9.47088 40.2568 25.1663C-1.07657 42.8926 -22.2433 105 37.7568 137.5C61.7568 148 122.757 149.382 151.757 139.784Z" fill="url(#paint0_linear_57_7)" stroke="black" />
                        <path d="M152.757 53.5001H40.7567C34.1293 53.5001 28.7567 58.8726 28.7567 65.5001V97.5001C28.7567 104.127 34.1293 109.5 40.7567 109.5H152.757C159.384 109.5 164.757 104.127 164.757 97.5001V65.5001C164.757 58.8726 159.384 53.5001 152.757 53.5001Z" fill="#DB3A3A" stroke="black" />
                        <path d="M109.725 68.4774C107.027 68.4774 82.7408 57.7472 85.4393 41.2393C85.4393 41.2393 84.09 35.049 55.7567 52.3821C63.852 31.3348 84.09 27.6205 84.09 27.6205C84.09 27.6205 81.3916 20.1915 61.1535 20.1916C80.0424 9.04848 92.1853 14.0007 100.281 20.1915C104.328 11.5245 123.217 11.5249 138.058 20.1916C113.773 20.1916 112.423 30.0964 112.423 32.5726C112.423 32.5726 123.217 37.5251 140.757 35.0488C134.011 40.0014 120.519 47.4295 107.027 44.9536C96.6825 52.7948 105.677 62.2869 109.725 68.4774Z" fill="url(#paint1_linear_57_7)" stroke="black" />
                        <path d="M98.9313 0.648398C106.487 4.6103 102.979 25.4103 100.28 35.3151C99.9576 36.5001 92.5415 35.3151 92.808 34.5001C95.5064 26.2461 98.4148 10.325 90.8593 4.38214C92.2104 1.86071 96.0082 -0.05933 98.9313 0.648398Z" fill="url(#paint2_linear_57_7)" stroke="black" />
                        <defs>
                            <linearGradient id="paint0_linear_57_7" x1="227.257" y1="34.9759" x2="-49.1143" y2="179.358" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#DD1010" />
                                <stop offset="1" stop-color="#961616" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_57_7" x1="115.148" y1="1.87049" x2="69.8686" y2="86.0025" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#40BA46" />
                                <stop offset="1" stop-color="#1D541F" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_57_7" x1="102.071" y1="6.38214" x2="79.6328" y2="9.10102" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#40BA46" />
                                <stop offset="1" stop-color="#1D541F" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <ButtonContainer>
                    <span className="flex gap-2 mt-2">
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
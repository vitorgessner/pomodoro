import { createContext, useContext } from 'react';
import type { TimerState } from '../../types/TimerState';

export const TimerContext = createContext<TimerState | undefined>(undefined);

export const useTimerContext = () => {
    const timer = useContext(TimerContext);

    if (timer === undefined) throw new Error("TimerContext mustn't be undefined")

    return timer;
}
import { useTimerContext } from "@/context/TimerContext/TimerContext";

type TimerProps = {
    handleSessionTypeChange?: (type: "session" | "break" | "longBreak") => void;
};

export const Timer = ({ handleSessionTypeChange }: TimerProps) => {
    const state = useTimerContext()

    return (
        <div className="mt-6 absolute z-10">
            <h2 className="timer"
                onChange={() => {
                    if (handleSessionTypeChange) handleSessionTypeChange(state.currentType)
                }}>
                {state.remaining < 600 ? `0${Math.floor(state.remaining / 60)}` : Math.floor(state.remaining / 60)}:
                {state.remaining % 60 < 10 ? `0${Math.floor(state.remaining % 60)}` : Math.floor(state.remaining % 60)}
            </h2>
        </div>
    )
}
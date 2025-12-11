import { useTimerContext } from "@/context/TimerContext/TimerContext";

type TimerProps = {
    handleSessionTypeChange?: (type: "session" | "break" | "longBreak") => void;
};

export const Timer = ({ handleSessionTypeChange }: TimerProps) => {
    const state = useTimerContext()

    return (
        <div className="mt-2">
            <h2 className="text-7xl border-4 border-red-600 rounded-md py-2 px-7 text-white shadow-red-400 shadow-md bg-radial-[at_50%_0%] from-green-700 from-20% via-red-500 via-40% to-red-600 selection:bg-transparent"
                onChange={() => {
                    if (handleSessionTypeChange) handleSessionTypeChange(state.currentType)
                }}>
                {state.remaining < 600 ? `0${Math.floor(state.remaining / 60)}` : Math.floor(state.remaining / 60)}:
                {state.remaining % 60 < 10 ? `0${Math.floor(state.remaining % 60)}` : Math.floor(state.remaining % 60)}
            </h2>
        </div>
    )
}
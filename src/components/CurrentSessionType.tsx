import { useTimerContext } from "@/context/TimerContext/TimerContext";

export const CurrentSessionType = () => {
    const state = useTimerContext()

    return (
        <div className="mb-10">
            <h1 className="text-5xl">{
                state.currentType === "longBreak" ? "Long Break" :
            state.currentType[0].toUpperCase() + state.currentType.substring(1)
            }</h1>
            <p className="count">#{state.sessionCount}</p>
        </div>
    );
}
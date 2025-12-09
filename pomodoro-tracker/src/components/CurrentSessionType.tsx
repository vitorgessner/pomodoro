type CurrentSessionTypeProps = {
    type: "session" | "break" | "longBreak";
    count: number;
};

export const CurrentSessionType = ({type, count} : CurrentSessionTypeProps) => {
    return (
        <div className="mb-10">
            <h1 className="text-5xl">{
                type === "longBreak" ? "Long Break" :
            type[0].toUpperCase() + type.substring(1)
            }</h1>
            <p className="text-md flex justify-center opacity-70 font-bold mt-2 text-xl">#{count}</p>
        </div>
    );
}
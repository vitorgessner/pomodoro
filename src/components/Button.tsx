import { Play, Pause, Square, Pencil } from "lucide-react";

interface ButtonTypes extends React.HTMLProps<HTMLButtonElement> {
    type: "start" | "pause" | "stop" | "session" | "break" | "longBreak" | "edit";
};

const config = {
    start: {
        class: "bg-green-500 hover:bg-green-700",
        Icon: Play
    },
    pause: {
        class: "bg-yellow-500 hover:bg-yellow-700",
        Icon: Pause
    },
    stop: {
        class: "bg-red-500 hover:bg-red-700",
        Icon: Square
    },
    edit: {
        class: "bg-gray-500 hover:bg-gray-700 absolute left-2 top-2",
        Icon: Pencil
    },
    session: {
        class: "bg-blue-500 hover:bg-blue-700",
        Icon: null
    },
    break: {
        class: "bg-green-500 hover:bg-green-700",
        Icon: null
    },
    longBreak: {
        class: "bg-purple-500 hover:bg-purple-700",
        Icon: null
    }
}

export const Button = ({ type, onClick, ...props }: ButtonTypes) => {
    const { class: color, Icon } = config[type];

    return (
        <button className={`text-white font-bold py-2 px-2 rounded text-sm ${color} disabled:bg-accent-foreground`}
            onClick={onClick} {...props}>
            {Icon && <Icon stroke="white" size={20} />}
            {!Icon && 
            (type === "longBreak" ? "Long Break" : 
            type[0].toUpperCase() + type.substring(1))}
        </button>
    )
}
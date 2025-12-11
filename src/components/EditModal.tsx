import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from './Button'
import { useCallback, useState, type ActionDispatch } from "react";
import type { SessionType } from '../types/TimerState'
import type { TimerAction } from "../context/TimerContext/timerActions";
import { useTimerContext } from "@/context/TimerContext/TimerContext";

type EditModalProps = {
    dispatch: ActionDispatch<[action: TimerAction]>;
}

export const EditModal = ({ dispatch }: EditModalProps) => {
    const [open, setOpen] = useState(false);
    const state = useTimerContext();

    const handleTimeConfigChange = useCallback((value: string, type: SessionType) => {
        const minutes = Number(value);
        if (minutes > 0) {
            dispatch({
                type: 'UPDATE_EDIT_CONFIG',
                payload: { key: type, value: minutes * 60 }
            });
        }
    }, [dispatch]);

    const saveTimeConfig = useCallback(() => {
        dispatch({ type: 'SAVE_CONFIG' });
    }, [dispatch])

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button type="edit" disabled={state.isRunning} />
            </AlertDialogTrigger>
            <AlertDialogContent
                className="sm:max-w-3xs max-w-3xs text-left">
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit timers</AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col justify-start items-start"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                console.log(e.key);
                                saveTimeConfig()
                                setOpen(false);
                            }
                        }}>

                        <label htmlFor="session">Session: </label>
                        <input type="number" min={1} step={1} id="session" autoFocus className="border-2 px-2 py-1 w-full my-2"
                            defaultValue={state.config.session / 60}
                            onChange={(event) => handleTimeConfigChange(event.target.value, 'session')}
                        />

                        <label htmlFor="break">Break: </label>
                        <input type="number" id="break" className="border-2 px-2 py-1 w-full my-2"
                            defaultValue={state.config.break / 60}
                            onChange={(event) => handleTimeConfigChange(event.target.value, 'break')} 
                        />

                        <label htmlFor="longBreak">Long Break: </label>
                        <input type="number" id="longBreak" className="border-2 px-2 py-1 w-full my-2"
                            defaultValue={state.config.longBreak / 60}
                            onChange={(event) => handleTimeConfigChange(event.target.value, 'longBreak')} 
                        />
                        
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={saveTimeConfig}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
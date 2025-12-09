import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from './Button'
import { useCallback, type ActionDispatch } from "react";
import type { TimerAction, SessionType, TimerState } from '../types/TimerState'

type EditModalProps = {
    state: TimerState;
    dispatch: ActionDispatch<[action: TimerAction]>;
}

export const EditModal = ({state, dispatch}: EditModalProps) => {
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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type="edit" />
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-3xs">
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit timers</AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col">
                        <form action="">
                            <label htmlFor="session">Session: </label>
                            <input type="number" min={1} step={1} id="session" className="border-2 px-2 py-1 max-w-sm my-2"
                                defaultValue={state.config.session / 60}
                                onChange={(event) => handleTimeConfigChange(event.target.value, 'session')}
                            />
                            <label htmlFor="break">Break: </label>
                            <input type="number" id="break" className="border-2 px-2 py-1 max-w-sm my-2"
                                defaultValue={state.config.break / 60}
                                onChange={(event) => handleTimeConfigChange(event.target.value, 'break')} />
                            <label htmlFor="longBreak">Long Break: </label>
                            <input type="number" id="longBreak" className="border-2 px-2 py-1 max-w-sm my-2"
                                defaultValue={state.config.longBreak / 60}
                                onChange={(event) => handleTimeConfigChange(event.target.value, 'longBreak')} />
                        </form>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={saveTimeConfig}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
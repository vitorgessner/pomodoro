export const ButtonContainer = ({children} : React.PropsWithChildren) => {
    return (
        <div className="flex mt-2 gap-1 flex-start justify-between w-[234px]">
            {children}
        </div>
    )
}
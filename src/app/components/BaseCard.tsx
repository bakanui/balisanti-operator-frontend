interface IProps {
    children: React.ReactNode
}
export const BaseCard = (props: IProps) => {
    return(
        <div className="bg-white dark:bg-slate-700 p-2 sm:p-8 rounded-xl">
            {props.children}
        </div>
    );
}
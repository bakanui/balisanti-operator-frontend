interface IProps {
    text: string;
    selected: boolean;
    onClick?: () => void;
}
export const Radio = (props: IProps) => {
    return(
        <div onClick={props.onClick} className="flex cursor-pointer w-fit">
            <div className={`h-[20px] w-[20px] rounded-full bg-white ${props.selected ? 'border-primary' : 'border-slate-300'} border-[1px] flex items-center justify-center`}>
                {props.selected && <div className="h-[14px] w-[14px] rounded-full bg-primary"></div>}
            </div>
            <div className="text-sm font-robotoregular ml-2">{props.text}</div>
        </div>
    );
}
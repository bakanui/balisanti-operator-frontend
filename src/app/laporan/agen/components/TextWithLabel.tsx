
interface IProps {
    title: string;
    value: string;
    color: string;
}
export const TextWithLabel = (props: IProps) => {
    return(
        <div className="flex flex-col">
            <div className="text-xs font-robotoregular">{props.title}</div>
            <div className={`text-[32px] font-robotomedium text-[${props.color}]`}>{props.value}</div>
        </div>
    );
}
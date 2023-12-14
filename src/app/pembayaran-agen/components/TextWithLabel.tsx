
interface IProps {
    title: string;
    value: string;
    color?: string;
    type?: 'primary' | 'success' | 'danger';
    size?: 'sm' | 'lg'
}
export const TextWithLabel = (props: IProps) => {
    if (props.type == 'primary') {
        return(
            <div className="flex flex-col">
                <div className="text-xs font-robotoregular">{props.title}</div>
                <div className={`${props.size && props.size == 'sm' ? 'text-[18px]' : 'text-[32px]'} font-robotomedium text-[#008AA1]`}>{props.value}</div>
            </div>
        );
    }
    if (props.type == 'success') {
        return(
            <div className="flex flex-col">
                <div className="text-xs font-robotoregular">{props.title}</div>
                <div className={`${props.size && props.size == 'sm' ? 'text-[18px]' : 'text-[32px]'} font-robotomedium text-[#48CF8E]`}>{props.value}</div>
            </div>
        );
    }
    if (props.type == 'danger') {
        return(
            <div className="flex flex-col">
                <div className="text-xs font-robotoregular">{props.title}</div>
                <div className={`${props.size && props.size == 'sm' ? 'text-[18px]' : 'text-[32px]'} font-robotomedium text-[#EA4335]`}>{props.value}</div>
            </div>
        );
    }
    return(
        <div className="flex flex-col">
            <div className="text-xs font-robotoregular">{props.title}</div>
            <div className={`${props.size && props.size == 'sm' ? 'text-[18px]' : 'text-[32px]'} font-robotomedium`}>{props.value}</div>
        </div>
    );
}
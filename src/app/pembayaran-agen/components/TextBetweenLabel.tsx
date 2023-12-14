import { StringIterator } from "lodash";

interface IProps {
    title: string;
    prefix: string;
    sufix?: string;
    size?: 'xs';
}
export const TextBetweenLabel = (props: IProps) => {
    return(
        <div className="flex flex-col">
            <div className="text-xs font-robotoregular">{props.title}</div>
            <div className="flex justify-between">
                <div className={`${props.size && props.size == 'xs' ? 'text-[14px]' : 'text-[18px]'} font-robotomedium`}>{props.prefix}</div>
                <div className={`${props.size && props.size == 'xs' ? 'text-[14px]' : 'text-[18px]'} font-robotomedium`}>{props.sufix}</div>
            </div>
        </div>
    );
}
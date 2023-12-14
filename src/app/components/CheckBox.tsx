import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface IProps {
    text: string;
    selected: boolean;
    onClick?: () => void;
}
export const CheckBox = (props: IProps) => {
    return(
        <div onClick={props.onClick} className="flex cursor-pointer w-fit">
            <div className={`h-[20px] w-[20px] rounded-md ${props.selected ? 'border-primary bg-primary' : 'border-slate-300 bg-white'} border-[1px] flex items-center justify-center`}>
                {props.selected && <FontAwesomeIcon className='text-white' icon={faCheck}/>}
            </div>
            <div className="text-sm font-robotoregular ml-2">{props.text}</div>
        </div>
    );
}
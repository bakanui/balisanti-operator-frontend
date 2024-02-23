import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Link from 'next/link';
interface IProps {
    label: string;
    outline?: boolean;
    icon?: any;
    onClick?: ()=>void;
    href?: string;
}
export const Button = (props: IProps) => {
    if(props.outline) {
        return <button onClick={props.onClick} className="h-[48px] w-full text-sm rounded-lg font-robotoregular border-solid border-2 border-primary hover:bg-slate-200 dark:text-white hover:dark:text-white">{props.label}</button>
    }
    return(
        <button onClick={props.onClick} className="bg-primary h-[48px] w-full text-white text-sm rounded-lg font-robotoregular hover:bg-primary-dark">
            {props.icon && <FontAwesomeIcon className="mr-2 text-md" icon={props.icon}/> }
            {props.label}
        </button>
    );
}

interface IActionButtonProps {
    label: string;
    outline?: boolean;
    icon?: any;
    onEdit?: () => void;
    onDelete?: () => void;
}
export const ActionButton = (props: IActionButtonProps) => {
    return(
        <Popup trigger={<button className="h-[28px] w-[80px] text-xs rounded-full font-robotoregular border-solid border-2 border-primary hover:bg-primary hover:text-white">{props.label}</button>} position="bottom center">
            <div>
                <ul>
                    <li onClick={props.onEdit} className="cursor-pointer text-sm font-robotoregular p-2 cursor-pointer hover:bg-primary rounded-lg hover:text-white dark:text-black">Edit</li>
                    <li onClick={props.onDelete} className="cursor-pointer text-sm font-robotoregular p-2 cursor-pointer hover:bg-primary rounded-lg hover:text-white dark:text-black">Hapus</li>
                </ul>
            </div>
        </Popup>
    );
}

export const SmallBorderedButton = (props: IProps) => {
    return(
        <button onClick={props.onClick} className="h-[28px] w-[80px] text-xs rounded-full font-robotoregular border-solid border-2 border-primary hover:bg-primary hover:text-white">{props.label}</button>
    );
}

export const LButton = (props: IProps) => {
    return(
        <Link href={props.href || ''} target='_blank'>
            <button className="h-[48px] w-full text-sm rounded-lg font-robotoregular border-solid border-2 border-primary hover:bg-slate-200 dark:text-black">{props.label}</button>
        </Link>
    );
}
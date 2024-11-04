import { HTMLInputTypeAttribute } from "react";
import { InputType } from "zlib";

interface IProps {
    label: string;
    placeholder: string;
    value?: any;
    onChangeText: (e: any)=> void;
    disabled?: boolean;
    subtitle?: string;
    type?: HTMLInputTypeAttribute;
}
export const InputQty = (props: IProps) => {
    return(
        <div className="sm:flex sm:flex-col w-full">
    <div className="flex items-center mb-2">
        <div className="font-robotomedium text-sm">{props.label}</div>
        {props.subtitle && <div className="text-[8pt] font-robotoregular ml-2">{props.subtitle}</div>}
    </div>
    <div className="flex items-center mb-4">
        <input 
            value={props.value || 0} 
            onChange={e => props.onChangeText(Number(e.target.value))}
            className={`text-input text-sm text-center w-12 border-primary ${props.disabled && 'bg-slate-300'}`} 
            placeholder={props.placeholder} 
            type="number"
            min="0"
            disabled={props.disabled}
        />
    </div>
</div>

    );
}

export const InputBtn = (props: IProps) => {
    return(
        <div className="sm:flex sm:flex-col w-full">
            <div className="flex items-center mb-2">
                <div className="font-robotomedium text-sm">{props.label}</div>
                {props.subtitle && <div className="text-[8pt] font-robotoregular ml-2">{props.subtitle}</div>}
            </div>
            <input value={props.value} onChange={props.onChangeText} className={`text-input text-sm mb-4 border-primary ${props.disabled && 'bg-slate-300'}`} placeholder={props.placeholder} type={props.type || 'text'}/>
            <button className="h-[48px] text-sm rounded-lg font-robotoregular border-solid border-2 border-primary hover:bg-slate-200 dark:text-black">Cari</button>
        </div>
    );
}

interface ISProps {
    placeholder: string;
}
export const SecondaryInput = (props: ISProps) => {
    return(
        <div className="sm:flex sm:flex-col w-full">
            <input className="h-[32px] w-full text-xs rounded-lg font-robotoregular border-solid border-2 border-[#B7BFDD] pl-2 pr-4" placeholder={props.placeholder}/>
        </div>
    );
}
import { useCallback, useEffect } from 'react';
import Select from 'react-select'
interface IProps {
    label: string;
    placeholder: string;
    onChange?: (data: any)=>void;
    value?: {
        value: string;
        label: string;
    };
    option: {
        value: string;
        label: string;
    }[];
    disable?: boolean;
    onValueHasChanged?: () => void;
}
export const SelectBox = (props: IProps) => {
    useEffect(()=> {
        props.onValueHasChanged && props.onValueHasChanged();
    },[props.value]);
    return(
        <div className="sm:flex sm:flex-col w-full">
            {props.label && <div className="font-robotomedium mb-2 text-sm">{props.label}</div>}
            <Select 
                options={props.option} 
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                isDisabled={props.disable}
                classNames={{
                    control: () => 'text-input text-sm font-robotoregular mb-4 cursor-pointer dark:bg-[#3b3b3b] text-white',
                    option: () => 'dark:text-black',
                    input: ()=> 'dark:text-white',
                    singleValue: () => 'dark:text-white',
                }}
            />
        </div>
    );
}
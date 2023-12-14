import Select from 'react-select'
interface IProps {
    label?: string;
    placeholder: string;
    option: {
        value: string;
        label: string;
    }[];
    onChange?: (data: any)=> void;
    value?: string;
}
export const SecondarySelectBox = (props: IProps) => {
    return(
        <div className="sm:flex sm:flex-col w-full">
            {props.label && <div className="font-robotoregular mb-2 text-xs">{props.label}</div>}
            <select
            onChange={props.onChange}
            value={props.value}
            className="h-[32px] w-full text-xs rounded-lg font-robotoregular border-solid border-2 border-[#B7BFDD] pl-2 pr-4">
                {props.option.map((item)=>{
                    return(
                        <option key={item.value} value={item.value}>{item.label}</option>
                    );
                })}
            </select>
        </div>
    );
}
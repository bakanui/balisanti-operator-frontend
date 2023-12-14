import { useEffect, useState } from "react";
import { addCommas, convertLabelToPrice, removeNonNumeric } from "../utils/utility";

interface IProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string)=> void;
}
export const PriceInput = (props: IProps) => {
    const [val, setVal] = useState<any>(0);
    
    useEffect(()=> {
        if (props.value) {
          let formattedNumber = addCommas(removeNonNumeric(props.value));
          props.onChangeText(formattedNumber);
        }
    } ,[]);

    useEffect(()=> {
      if (typeof props.value == 'number' || typeof props.value == 'string') {
        setVal(convertLabelToPrice(props.value));
      }
    }, [props.value]);

    const handleChange = (event: any) => {
      setVal(convertLabelToPrice(event.target.value));
        props.onChangeText(addCommas(removeNonNumeric(event.target.value)));
    }

    return(
        <div className="sm:flex sm:flex-col w-full">
            <div className="font-robotomedium mb-2 text-sm">{props.label}</div>
            <input 
            value={val} 
            defaultValue={'0'} 
            onInput={handleChange}
            className="text-input text-sm mb-4 border-primary" 
            placeholder={props.placeholder}/>
        </div>
    );
}
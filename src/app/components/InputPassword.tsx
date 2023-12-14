
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react';

interface IProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (e: any)=> void;
    hideForgotPassword?: boolean;
}
export const InputPassword = (props: IProps) => {
    const [hidden, setHidden] = useState(true);

    const _makeHidden = () => {
        setHidden(!hidden);
    }

    return(
        <div className='w-full'>
            <div className="flex flex-row justify-between">
                <div className="font-robotoregular mb-2 text-sm">{props.label}</div>
                {!props.hideForgotPassword && <div className="text-sm font-robotoregular text-primary mb-2 cursor-pointer">Forgot pasword?</div>}
            </div>
            <div className='relative'>
                <input 
                className="text-input text-sm" 
                type={hidden ? 'password' : 'text'}
                onChange={props.onChangeText}
                value={props.value}
                placeholder={props.placeholder}/>
                <div className='absolute top-3 right-2 cursor-pointer' onClick={_makeHidden}>
                    {!hidden ? 
                        <FontAwesomeIcon className='h-[24px] w-[24px] text-[#94a3b8]' icon={faEye} />
                        :                    
                        <FontAwesomeIcon className='h-[24px] w-[24px] text-[#94a3b8]' icon={faEyeSlash} />
                    }
                </div>
            </div>
        </div>
    );
}
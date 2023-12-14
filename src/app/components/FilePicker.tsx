import 'reactjs-popup/dist/index.css';

interface IProps {
    label: string;
    onClick?: (e: any)=> void;
    type?: string;
}
export const FilePicker = (props: IProps) => {
    return(
        <div className="sm:flex sm:flex-col w-full">
            <div className="flex items-center mb-2">
                <div className="font-robotomedium text-sm">{props.label}</div>
            </div>
            <input 
            className="file:h-[48px] file:rounded-[8px] file:rounded-r-none file:text-slate-500 file:border-0 border-[1px] file:bg-[#DFDFDF] border-[#B7BFDD] cursor-pointer block w-full text-sm rounded-lg cursor-pointer text-slate-500 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-slate-500" 
            type="file" 
            accept={props.type || 'image/*,.pdf'}
            onChange={props.onClick}></input>
        </div>
    );
}

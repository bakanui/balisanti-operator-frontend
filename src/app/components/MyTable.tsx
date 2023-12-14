
interface ICustomTable {
    children: React.ReactNode;
}
export const CustomTable = (props: ICustomTable) => {
    return(
        <table className="border-collapse w-full p-8 my-4 text-left">
            {props.children}
        </table>
    );
}

interface IHeadTb {
    children: React.ReactNode;
}

export const HeadTb = (props: IHeadTb) => {
    return(
        <thead className="border border-[black] border-x-0 ">
            {props.children}
        </thead>
    );
}

interface IProps {
    children: React.ReactNode;
    strip?: boolean;
    onClick?: ()=>void;
    is_canceled?: number;
}
export const TableRow = (props: IProps) => {
    return(
        <tr onClick={props.onClick} className={`${props.is_canceled == 1 ? 'bg-red-400 text-white' : ''} text-sm font-robotoregular ${props.strip && props.is_canceled != 1 ? 'bg-[#F0F0F0] dark:bg-slate-500' : undefined} ${props.onClick ? 'cursor-pointer hover:bg-slate-300' : undefined}`}>
            {props.children}
        </tr>
    );
}
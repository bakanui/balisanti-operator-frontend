interface IProps {
    text: string;
    status: boolean;

}
export const Badge = (props: IProps) => {
    return(
        <div className={`${props.status? 'bg-secondary' : 'bg-rose-500'} text-white rounded-full text-[8pt] py-[2px] w-[5rem] flex justify-center items-center`}>
           {props.text}
        </div>
    );
}
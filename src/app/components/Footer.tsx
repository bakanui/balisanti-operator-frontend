export const Footer = () => {
    const date = new Date();
    return(
        <div className="w-full h-[130px] flex pb-6 items-center justify-between">
            <span className="text-xs font-robotomregular">{date.getFullYear()}</span>
            <span className="text-xs font-robotoregular cursor-pointer" >Design & Develop by Maiharta</span>
        </div>
    );
}
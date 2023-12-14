import { Footer } from "./Footer";

interface IProps {
    children: React.ReactNode;
}
export const BaseContainer = (props: IProps) => {
    return(
        <div className="p-4 h-screen overflow-auto">
            <div className="h-[40px]"></div>
            {props.children}
            {/* <div className="h-[40px] bg-[green] mt-auto">
                footer
            </div> */}
        </div>
    );
}
import Link from "next/link";
import { MenuItem } from "react-pro-sidebar";

interface IProps {
    icon: any;
    text: string;
    href: string;
    path: string | null;
}
export const SideMenuItem = (props: IProps) => {
    return(
        <MenuItem 
            style={{
                marginLeft: '2.5rem',
            }}
            component={<Link href={props.href} />}
            active={props.path ? props.path.includes(props.href) : false}
            icon={props.icon}
        > 
            <span className='font-robotoregular text-sm'>{props.text}</span>
        </MenuItem>
    );
}
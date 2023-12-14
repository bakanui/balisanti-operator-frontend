interface IProps {
    fill?: string;
}
export const UserIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.02 3.06274C14.18 2.42274 13.14 2.05273 12 2.05273C9.24 2.05273 7 4.29273 7 7.05273C7 9.81273 9.24 12.0527 12 12.0527C14.76 12.0527 17 9.81273 17 7.05273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20.59 22.0527C20.59 18.1827 16.74 15.0527 12 15.0527C7.26003 15.0527 3.41003 18.1827 3.41003 22.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}
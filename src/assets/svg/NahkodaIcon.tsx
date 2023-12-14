interface IProps {
    fill?: string;
}
export const NahkodaIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.02 3.06274C14.18 2.42274 13.14 2.05273 12 2.05273C9.24 2.05273 7 4.29273 7 7.05273C7 9.81273 9.24 12.0527 12 12.0527C14.76 12.0527 17 9.81273 17 7.05273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3.40991 22.0527C3.40991 18.1827 7.25994 15.0527 11.9999 15.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.2 21.4528C19.9673 21.4528 21.4 20.0201 21.4 18.2527C21.4 16.4854 19.9673 15.0527 18.2 15.0527C16.4327 15.0527 15 16.4854 15 18.2527C15 20.0201 16.4327 21.4528 18.2 21.4528Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 22.0527L21 21.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}
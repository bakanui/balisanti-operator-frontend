interface IProps {
    fill?: string;
}
export const ScanIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 9.05273V6.55273C2 4.06273 4.01 2.05273 6.5 2.05273H9" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 2.05273H17.5C19.99 2.05273 22 4.06273 22 6.55273V9.05273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 16.0527V17.5527C22 20.0427 19.99 22.0527 17.5 22.0527H16" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 22.0527H6.5C4.01 22.0527 2 20.0427 2 17.5527V15.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5 7.05273V9.05273C10.5 10.0527 10 10.5527 9 10.5527H7C6 10.5527 5.5 10.0527 5.5 9.05273V7.05273C5.5 6.05273 6 5.55273 7 5.55273H9C10 5.55273 10.5 6.05273 10.5 7.05273Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.5 9.05273V7.05273C13.5 6.05273 14 5.55273 15 5.55273H17C18 5.55273 18.5 6.05273 18.5 7.05273V9.05273C18.5 10.0527 18 10.5527 17 10.5527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 13.5527H9C10 13.5527 10.5 14.0527 10.5 15.0527V17.0527C10.5 18.0527 10 18.5527 9 18.5527H7C6 18.5527 5.5 18.0527 5.5 17.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.5 15.0527V17.0527C18.5 18.0527 18 18.5527 17 18.5527H15C14 18.5527 13.5 18.0527 13.5 17.0527V15.0527C13.5 14.0527 14 13.5527 15 13.5527H17C18 13.5527 18.5 14.0527 18.5 15.0527Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
}
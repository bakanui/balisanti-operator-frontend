interface IProps {
    fill?: string;
}
export const MoneyIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8.55273C2 5.05273 4 3.55273 7 3.55273H17C20 3.55273 22 5.05273 22 8.55273V15.5527C22 19.0527 20 20.5527 17 20.5527H7C4 20.5527 2 19.0527 2 15.5527V12.5828" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 12.0527C15 10.3927 13.66 9.05273 12 9.05273C10.34 9.05273 9 10.3927 9 12.0527C9 13.7127 10.34 15.0527 12 15.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 7.05273H16" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 17.0527H5" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}
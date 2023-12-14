interface IProps {
    fill?: string;
}
export const ReportIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7.05273C3 4.05273 4.5 2.05273 8 2.05273H16C19.5 2.05273 21 4.05273 21 7.05273V17.0527C21 20.0527 19.5 22.0527 16 22.0527H8C4.5 22.0527 3 20.0527 3 17.0527V11.0728" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 4.55273V6.55273C14.5 7.65273 15.4 8.55273 16.5 8.55273H18.5" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 13.0527H12" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 17.0527H16" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
}
interface IProps {
    fill?: string;
}
export const SopIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.96 2.05273H10C9 2.05273 8 2.05273 8 4.05273C8 6.05273 9 6.05273 10 6.05273H14C16 6.05273 16 5.05273 16 4.05273C16 2.05273 15 2.05273 14 2.05273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 10.0528C3 5.49275 4.67 4.25275 8 4.07275" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 4.07275C19.33 4.25275 21 5.48275 21 10.0528V16.0528C21 20.0528 20 22.0528 15 22.0528H9C4 22.0528 3 20.0528 3 16.0528V13.9628" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}
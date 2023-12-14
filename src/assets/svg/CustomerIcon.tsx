interface IProps {
    fill?: string;
}
export const CustomerIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.02 3.06274C14.18 2.42274 13.14 2.05273 12 2.05273C9.24 2.05273 7 4.29273 7 7.05273C7 9.81273 9.24 12.0527 12 12.0527C14.76 12.0527 17 9.81273 17 7.05273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3.41003 22.0527C3.41003 18.1827 7.26003 15.0527 12 15.0527C12.96 15.0527 13.89 15.1827 14.76 15.4227" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 18.0527C22 18.3727 21.96 18.6827 21.88 18.9827C21.79 19.3827 21.63 19.7727 21.42 20.1127C20.73 21.2727 19.46 22.0527 18 22.0527C16.97 22.0527 16.04 21.6627 15.34 21.0227C15.04 20.7627 14.78 20.4527 14.58 20.1127C14.21 19.5127 14 18.8027 14 18.0527C14 16.9727 14.43 15.9828 15.13 15.2628C15.86 14.5128 16.88 14.0527 18 14.0527C19.18 14.0527 20.25 14.5628 20.97 15.3828C21.61 16.0928 22 17.0327 22 18.0527Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.49 18.0327H16.51" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 16.5728V19.5627" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}
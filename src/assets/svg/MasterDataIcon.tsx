interface IProps {
    fill?: string;
}
export const MasterDataIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 14.0527C21.1046 14.0527 22 13.1573 22 12.0527C22 10.9482 21.1046 10.0527 20 10.0527C18.8954 10.0527 18 10.9482 18 12.0527C18 13.1573 18.8954 14.0527 20 14.0527Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 6.05273C21.1046 6.05273 22 5.1573 22 4.05273C22 2.94816 21.1046 2.05273 20 2.05273C18.8954 2.05273 18 2.94816 18 4.05273C18 5.1573 18.8954 6.05273 20 6.05273Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 22.0527C21.1046 22.0527 22 21.1573 22 20.0527C22 18.9482 21.1046 18.0527 20 18.0527C18.8954 18.0527 18 18.9482 18 20.0527C18 21.1573 18.8954 22.0527 20 22.0527Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 14.0527C5.10457 14.0527 6 13.1573 6 12.0527C6 10.9482 5.10457 10.0527 4 10.0527C2.89543 10.0527 2 10.9482 2 12.0527C2 13.1573 2.89543 14.0527 4 14.0527Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 12.0527H18" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11 12.0527V17.0527C11 19.0527 12 20.0527 14 20.0527H18" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 4.05273H14C12 4.05273 11 5.05273 11 7.05273V8.03271" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
}
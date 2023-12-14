interface IProps {
    fill?: string;
}
export const ManifestIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 10.0527V9.05273C22 5.05273 21 4.05273 17 4.05273H7C3 4.05273 2 5.05273 2 9.05273V9.55273C3.38 9.55273 4.5 10.6727 4.5 12.0527C4.5 13.4327 3.38 14.5527 2 14.5527V15.0527C2 19.0527 3 20.0527 7 20.0527H17C21 20.0527 22 19.0527 22 15.0527C20.62 15.0527 19.5 13.9327 19.5 12.5527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 4.05273L10 20.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 5"/>
        </svg>
    );
}
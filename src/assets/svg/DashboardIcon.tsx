interface IProps {
    fill?: string;
}
export const DashboardIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.73 2.05273C14.14 2.05273 13.5 2.65273 13.5 4.15273V10.9527C13.5 12.4527 14.14 13.0527 15.73 13.0527H19.77C21.36 13.0527 22 12.4527 22 10.9527V4.15273C22 2.65273 21.36 2.05273 19.77 2.05273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 19.9527V18.1527C22 16.6527 21.36 16.0527 19.77 16.0527H15.73C14.14 16.0527 13.5 16.6527 13.5 18.1527V19.9527C13.5 21.4527 14.14 22.0527 15.73 22.0527H19.77C21.36 22.0527 22 21.4527 22 19.9527Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.23 22.0527C2.64 22.0527 2 21.4527 2 19.9527V13.1527C2 11.6527 2.64 11.0527 4.23 11.0527H8.27C9.86 11.0527 10.5 11.6527 10.5 13.1527V19.9527C10.5 21.4527 9.86 22.0527 8.27 22.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.5 4.15273V5.95273C10.5 7.45273 9.86 8.05273 8.27 8.05273H4.23C2.64 8.05273 2 7.45273 2 5.95273V4.15273C2 2.65273 2.64 2.05273 4.23 2.05273H8.27C9.86 2.05273 10.5 2.65273 10.5 4.15273Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}
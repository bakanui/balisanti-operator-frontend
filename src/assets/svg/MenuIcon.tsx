interface IProps {
    fill?: string;
}
export const MenuIcon = (props: IProps) => {
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 4.13417C0 3.41016 0.596954 2.82324 1.33333 2.82324H22.6667C23.403 2.82324 24 3.41016 24 4.13417C24 4.85817 23.403 5.44509 22.6667 5.44509H1.33333C0.596954 5.44509 0 4.85817 0 4.13417Z" fill={props.fill || "#008AA1"}/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 11.9997C0 11.2757 0.596954 10.6888 1.33333 10.6888H22.6667C23.403 10.6888 24 11.2757 24 11.9997C24 12.7237 23.403 13.3106 22.6667 13.3106H1.33333C0.596954 13.3106 0 12.7237 0 11.9997Z" fill={props.fill || "#008AA1"}/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 19.8653C0 19.1413 0.596954 18.5543 1.33333 18.5543H22.6667C23.403 18.5543 24 19.1413 24 19.8653C24 20.5893 23.403 21.1762 22.6667 21.1762H1.33333C0.596954 21.1762 0 20.5893 0 19.8653Z" fill={props.fill || "#008AA1"}/>
        </svg>

    );
}
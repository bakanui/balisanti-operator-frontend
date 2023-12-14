import LoadingAnimation from '../../assets/animations/loading-spinner.json';
import Lottie from "lottie-react";

interface IProps {
    loading: boolean;
    title: string;
}

export const Loading = (props: IProps) => {
    return(
        <div className='flex flex-col items-center justify-center w-full'>
            <Lottie animationData={LoadingAnimation} style={{
                height: 120,
            }}/>
            <span className='font-robotomedium text-md'>{props.title}</span>
        </div>
    );
}
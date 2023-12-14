import Modal from 'react-modal';
import LoadingAnimation from '../../assets/animations/loading.json';
import Lottie from "lottie-react";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: 0,
      borderRadius: 20,
    },
    overlay: {
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
        backgroundColor:'rgba(0,0,0,0.5)'
    },
};
  
Modal.setAppElement('#loading');
  
interface IProps {
    loading: boolean;
    title: string;
}

export const LoadingOverlay = (props: IProps) => {
    return(
        <Modal
            isOpen={props.loading}
            style={customStyles}
            overlayClassName="Overlay"
        >
            <div className='flex flex-col items-center justify-center'>
                <Lottie animationData={LoadingAnimation} style={{
                    height: 120,
                }}/>
                <span className='font-robotomedium text-md'>{props.title}</span>
            </div>
        </Modal>
    );
}
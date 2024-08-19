import ReactLoading from 'react-loading';
import './LoadingScreen.css';

const LoadingScreen = () => {
    return (
        <div className='LoadingScreen'>
            <ReactLoading type='spinningBubbles' color='black' height={300} width={150} />
        </div>
    );
}
    
export default LoadingScreen;
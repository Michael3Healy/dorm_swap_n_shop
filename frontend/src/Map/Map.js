import './Map.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

const Map = ({ locationId, size, style }) => {
	return <img src={`${BASE_URL}/locations/${locationId}/map?size=${size}`} alt='map' className='img Map' style={style} />;
};

export default Map;

import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import Detect from './detect.png';


const Logo = () => {
	return(
		<div className='ma4 mt0'>
			{/* TO DO in React Tilt */}
			<Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
 				<div className="Tilt-inner"> 
 					<img style={{paddingTop:'45px'}} alt='Logo' src={Detect}/> 
 				</div>
			</Tilt>
		</div>
	);
}

export default Logo;
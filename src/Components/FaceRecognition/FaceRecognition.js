import React from 'react';
import './FaceRecognition.css';

const FaceRecognition =({imageUrl,leftColarray,rightColarray,botRowarray,topRowarray})=>{
 	const rows = [];
 	for (var i = 0; i < leftColarray.length; i++) {
    	rows.push(<div key={i} className= 'bounding_box' style={{top:topRowarray[i], right:rightColarray[i], bottom:botRowarray[i], left:leftColarray[i]}}></div>);
	}
	return(
		<div className='center ma'>
			<div className='absolute ma2'> 
				<img id='inputImage' alt='' src= {imageUrl} width='500px' height='auto'/>
				{rows}
			</div>		
		</div>
	)
}	

export default FaceRecognition;

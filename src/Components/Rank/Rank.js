import React from 'react';
import './Rank.css'

const Rank = ({name, entries}) =>{
	return(
		<div>
			<div id= 'rankText' className= 'white f3'>
				{`${name} , your current rank is`}
			</div>
			<div className= 'white f1'>
				 {entries}
			</div>
		</div>
	);
}

export default Rank;
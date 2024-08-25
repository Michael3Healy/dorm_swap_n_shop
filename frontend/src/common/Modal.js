import React from 'react';
import './Modal.css';

const MyModal = ({ show, handleClose, title, body, buttons }) => {
	return (
		<div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex='-1' role='dialog'>
			<div className='modal-dialog' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title'>{title}</h5>
						<button type='button' className='btn-close' onClick={handleClose}></button>
					</div>
					<div className='modal-body'>
						<p>{body}</p>
					</div>
					<div className='modal-footer'>
                        {buttons}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyModal;

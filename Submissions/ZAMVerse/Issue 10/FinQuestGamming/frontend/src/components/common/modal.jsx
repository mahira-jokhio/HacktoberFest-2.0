import React from 'react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
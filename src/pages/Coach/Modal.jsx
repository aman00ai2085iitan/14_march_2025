// Modal.js
import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, coachData, onSave }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    onSave({ ...coachData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Coach</h2>
        <div className="form-group">
          <label>Coach Unique No</label>
          <input
            type="text"
            name="coachUniqueNo"
            value={coachData.coachUniqueNo || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Make of Coach</label>
          <input
            type="text"
            name="makeOfCoach"
            value={coachData.makeOfCoach || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Type of Coach</label>
          <select
            name="typeOfCoach"
            value={coachData.typeOfCoach || ""}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="LHB">LHB</option>
            <option value="ICF">ICF</option>
          </select>
        </div>
        <div className="modal-buttons">
          <button className="btn-save" onClick={() => onSave(coachData)}>
            Save
          </button>
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
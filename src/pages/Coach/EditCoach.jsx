// EditCoach.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditCoach = ({ coachId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    coachUniqueNo: '',
    makeOfCoach: '',
    typeOfCoach: '',
  });

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const response = await axios.get(`https://smartcoachez.com/rail/public/api/coaches/${coachId}`);
        const data = response.data;

        // Populate form data with fetched data
        setFormData({
          coachUniqueNo: data.coach_number,
          makeOfCoach: data.make,
          typeOfCoach: data.type,
        });
      } catch (error) {
        console.error("Error fetching coach data:", error);
        toast.error('Failed to fetch coach data. Please try again.');
      }
    };

    fetchCoachData();
  }, [coachId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://smartcoachez.com/rail/public/api/update-coach/${coachId}`, formData);
      toast.success('Coach details updated successfully!');
      onSave(response.data); // Pass the updated data back to the parent
      onClose(); // Close the modal
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Failed to update coach details. Please try again.');
    }
  };

  return (
    <div className="edit-coach-modal">
      <h2>Edit Coach</h2>
      <div className="form-group">
        <label>Coach Unique No</label>
        <input
          type="text"
          name="coachUniqueNo"
          value={formData.coachUniqueNo}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Make of Coach</label>
        <input
          type="text"
          name="makeOfCoach"
          value={formData.makeOfCoach}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Type of Coach</label>
        <input
          type="text"
          name="typeOfCoach"
          value={formData.typeOfCoach}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default EditCoach;
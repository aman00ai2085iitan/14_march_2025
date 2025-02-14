import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import './Train.css'; // Ensure this is imported to apply styles

const EditTrain = ({ trainData, onSave, onClose }) => {
  const [trainNumber, setTrainNumber] = useState(trainData.train_number);
  const [trainName, setTrainName] = useState(trainData.train_name);
  const [departureStation, setDepartureStation] = useState(trainData.departure_station);
  const [destinationStation, setDestinationStation] = useState(trainData.destination_station);
  const [numberOfCoaches, setNumberOfCoaches] = useState(trainData.number_of_coaches);
  const [coaches, setCoaches] = useState(trainData.coaches || []); // Initialize coaches from trainData
  const [loading, setLoading] = useState(false); // State to manage loading state

  const handleSave = async () => {
    const updatedTrainData = {
      train_number: trainNumber,
      train_name: trainName,
      departure_station: departureStation,
      destination_station: destinationStation,
      number_of_coaches: numberOfCoaches,
      coaches: coaches, // Include the coaches in the update
    };

    setLoading(true); // Set loading to true before the request

    try {
      const response = await axios.put(`https://smartcoachez.com/rail/public/api/trains/${trainData.id}`, updatedTrainData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Call onSave with the updated train data if needed
      onSave(response.data.data);
      toast.success('Train updated successfully!'); // Show success toast
      onClose(); // Close the modal after saving
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating the train.';
      toast.error(errorMessage); // Show error toast
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  const handleCoachChange = (index, field, value) => {
    const updatedCoaches = [...coaches];
    updatedCoaches[index][field] = value;
    setCoaches(updatedCoaches);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Train</h2>
        <div>
          <label>Train Number</label>
          <input
            type="text"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Train Name</label>
          <input
            type="text"
            value={trainName}
            onChange={(e) => setTrainName(e.target.value)}
          />
        </div>
        <div>
          <label>Departure Station</label>
          <input
            type="text"
            value={departureStation}
            onChange={(e) => setDepartureStation(e.target.value)}
          />
        </div>
        <div>
          <label>Destination Station</label>
          <input
            type="text"
            value={destinationStation}
            onChange={(e) => setDestinationStation(e.target.value)}
          />
        </div>
        <div>
          <label>Number of Coaches</label>
          <input
            type="number"
            value={numberOfCoaches}
            onChange={(e) => {
              const newNumber = Math.max(1, e.target.value); // Ensure at least 1 coach
              setNumberOfCoaches(newNumber);
              // Adjust the coaches array based on the number of coaches
              const newCoaches = Array.from({ length: newNumber }, (_, i ) => ({
                coach_number: coaches[i]?.coach_number || '',
                position: coaches[i]?.position || '',
                display_id: coaches[i]?.display_id || '',
              }));
              setCoaches(newCoaches);
            }}
            min="1" // Ensure at least 1 coach
          />
        </div>
        {coaches.map((coach, index) => (
          <div key={index} className="coach-input">
            <h3>Coach {index + 1}</h3>
            <div>
              <label>Unique ID</label>
              <input
                type="text"
                value={coach.coach_number}
                onChange={(e) => handleCoachChange(index, 'coach_number', e.target.value)}
              />
            </div>
            <div>
              <label>Display ID</label>
              <input
                type="text"
                value={coach.display_id}
                onChange={(e) => handleCoachChange(index, 'display_id', e.target.value)}
              />
            </div>
            <div>
              <label>Position</label>
              <input
                type="number"
                value={coach.position}
                onChange={(e) => handleCoachChange(index, 'position', e.target.value)}
                min="1" // Ensure at least position 1
              />
            </div>
          </div>
        ))}
        <button className="save-button" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EditTrain;
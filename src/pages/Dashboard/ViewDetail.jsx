// // ViewDetail.js
// import React, { useEffect, useState } from 'react';
// import './ViewDetail.css'; // Create a CSS file for styling

// const ViewDetail = ({ trainNumber, onClose }) => {
//   const [trainDetails, setTrainDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTrainDetails = async () => {
//       try {
//         const response = await fetch(`https://smartcoachez.com/rail/public/api/trains/${trainNumber}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch train details');
//         }
//         const data = await response.json();
//         setTrainDetails(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrainDetails();
//   }, [trainNumber]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>&times;</span>
//         <h2>Train Details</h2>
//         <p><strong>Train Number:</strong> {trainDetails.trainNumber}</p>
//         <p><strong>Train Name:</strong> {trainDetails.trainName}</p>
//         <p><strong>From:</strong> {trainDetails.fromStation}</p>
//         <p><strong>To:</strong> {trainDetails.toStation}</p>
//         {/* Add more details as needed */}
//       </div>
//     </div>
//   );
// };

// export default ViewDetail;

// ViewDetail.js
import React from 'react';
import './ViewDetail.css'; // Ensure you have the CSS for styling

const ViewDetail = ({ trainNumber, onClose }) => {
  // Static train details
  const trainDetails = {
    trainNumber: trainNumber, // Use the passed train number
    trainName: "New Delhi - Amritsar Express",
    fromStation: "New Delhi",
    toStation: "Amritsar",
    coaches: 17,
    status: "Healthy",
    // Add more static details as needed
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Train Details</h2>
        <p><strong>Train Number:</strong> {trainDetails.trainNumber}</p>
        <p><strong>Train Name:</strong> {trainDetails.trainName}</p>
        <p><strong>From:</strong> {trainDetails.fromStation}</p>
        <p><strong>To:</strong> {trainDetails.toStation}</p>
        <p><strong>Coaches:</strong> {trainDetails.coaches}</p>
        <p><strong>Status:</strong> {trainDetails.status}</p>
        {/* Add more static details as needed */}
      </div>
    </div>
  );
};

export default ViewDetail;
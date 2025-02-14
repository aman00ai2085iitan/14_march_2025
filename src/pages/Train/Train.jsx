import React, { useState, useEffect } from "react";
import "./Train.css";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "../../assets/images/delete.jpg";
import EditIcon from "../../assets/images/edit.jpg";
import ViewIcon from "../../assets/images/view.jpeg"; // Import view icon
import ViewTrain from "./ViewTrain.jsx"; // Import the ViewTrain component
import EditTrain from "./EditTrain.jsx"; // Import the EditTrain component
import SearchTrain from "./SearchTrain.jsx"; // Import the SearchTrain component
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

const TrainConfig = () => {
  const [coaches, setCoaches] = useState([]);
  const [trainNumber, setTrainNumber] = useState("");
  const [trainName, setTrainName] = useState("");
  const [departureStation, setDepartureStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [numberOfCoaches, setNumberOfCoaches] = useState(0);
  const [savedCoaches, setSavedCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTrain, setCurrentTrain] = useState(null);
  const [isViewing, setIsViewing] = useState(false); // State for viewing train details
  const [viewTrainData, setViewTrainData] = useState(null); // State for train data to view
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items to display per page
  const [isSearching, setIsSearching] = useState(false); // State for search modal
  const [fetchedTrainData, setFetchedTrainData] = useState(null); // State to hold fetched train data
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNumberOfCoachesChange = (e) => {
    const number = e.target.value;
    setNumberOfCoaches(number);

    const newCoaches = [];
    for (let i = 0; i < number; i++) {
      newCoaches.push({
        id: Date.now() + i,
        uniqueId: "",
        displayId: `C${i + 1}`,
        position: i + 1, // Set position based on index
        status: "unconfigured",
      });
    }
    setCoaches(newCoaches);
  };

  const addCoach = () => {
    setCoaches([
      ...coaches,
      {
        id: Date.now(),
        uniqueId: "",
        displayId: "",
        position: coaches.length + 1, // Increment position
        status: "unconfigured",
      },
    ]);
  };

  const fetchTrainRecords = async () => {
    setLoading(true); // Show loader
    try {
      const response = await fetch(
        "https://smartcoachez.com/rail/public/api/trains"
      );
      if (response.ok) {
        const result = await response.json();
        console.log("Fetched train records:", result);

        if (result.success && Array.isArray(result.data)) {
          setSavedCoaches(result.data);
        } else {
          console.error("Fetched data is not in the expected format:", result);
        }
      } else {
        console.error("Failed to fetch train records");
      }
    } catch (error) {
      console.error("Error fetching train records:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    fetchTrainRecords();
  }, []);

  const removeCoach = (id) => {
    setCoaches(coaches.filter((coach) => coach.id !== id));
  };

  const updateCoach = (id, field, value) => {
    setCoaches((prevCoaches) =>
      prevCoaches.map((coach) =>
        coach.id === id ? { ...coach, [field]: value } : coach
      )
    );
  };

  const handleSave = async () => {
    if (
      !trainNumber ||
      !trainName ||
      !departureStation ||
      !destinationStation ||
      numberOfCoaches <= 0
    ) {
      toast.error("All fields are required."); // Show error toast return;
      return;
    }

    const trainData = {
 train_number: trainNumber,
      train_name: trainName,
      departure_station: departureStation,
      destination_station: destinationStation,
      number_of_coaches: numberOfCoaches,
      coaches: coaches.map((coach) => ({
        coach_number: coach.uniqueId, // Assuming uniqueId is used as coach_number
        position: coach.position,
        display_id: coach.displayId,
      })),
    };

    setLoading(true);

    try {
      const response = await fetch(
        "https://smartcoachez.com/rail/public/api/add-train",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trainData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Train added successfully!"); // Show success toast
        fetchTrainRecords(); // Refresh the train records after saving

        // Clear form inputs
        setTrainNumber("");
        setTrainName("");
        setDepartureStation("");
        setDestinationStation("");
        setNumberOfCoaches(0);
        setCoaches([]);
      } else {
        const errorData = await response.json();
        toast.error(
          `Error: ${errorData.message || "Failed to save train data"}`
        ); // Show error toast
      }
    } catch (error) {
      console.error("Error saving train:", error);
      toast.error(
        "Failed to save train. Please check your connection and try again."
      ); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  const deleteTrain = async (trainNumber) => {
    setLoading(true);
    try {
      const response = await fetch(`https://smartcoachez.com/rail/public/api/trains/${trainNumber}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Train deleted successfully!');
        fetchTrainRecords(); // Refresh the train records after deletion
      } else {
        const errorData = await response.json();
        if (errorData.message === 'Train not found!') {
          toast.error('Train not found!');
        } else {
          toast.error(`Error: ${errorData.message || 'Failed to delete train'}`);
        }
      }
    } catch (error) {
      console.error('Error deleting train:', error);
      toast.error('Failed to delete train. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSavedCoach = (index) => {
    const trainToDelete = savedCoaches[index];
    deleteTrain(trainToDelete.train_number); // Call deleteTrain with the train number
  };

  const handleEdit = (train) => {
    setCurrentTrain(train);
    setIsEditing(true);
  };

  const handleEditSave = (updatedTrain) => {
    setSavedCoaches((prev) =>
      prev.map((coach) =>
        coach.train_number === updatedTrain.train_number ? updatedTrain : coach
      )
    );
    setIsEditing(false);
  };

  const handleView = (train) => {
    setViewTrainData(train);
    setIsViewing(true);
  };

  const sortSavedCoaches = (coaches) => {
    return coaches.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  };

  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;

  const sortedCoaches = sortSavedCoaches([...savedCoaches]);
  const currentRecords = sortedCoaches.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sortedCoaches.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFetchClick = () => {
    setIsSearching(true); // Open the search modal
  };

  const handleFetchSuccess = (data) => {
    setFetchedTrainData(data); // Store fetched train data
    setIsSearching(false); // Close the search modal
  };

  return (
    <div className="train-config">
      <ToastContainer />
      <h1 className="train-config-heading">Train Configuration</h1>
      <div className="train-details">
        <h2>Train Details</h2>
        <p>Enter train number to fetch details automatically</p>

        {/* <div className="train-details-row">
          <div className="train-number-container"> */}

          <div className="train-details-grid">
          <div className="form-group">
            <label>Train Number</label>
            <div class Name="input-icon-container">
              <i className="fas fa-train icon"></i>
              <input
                type="text"
                placeholder="Train Number"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="train-number-input"
              />
            </div>
          </div>

          <div className="fetch-button-container">
            <button className="fetch-button" onClick={handleFetchClick}>
              {isSearching ? '' : 'Fetch'}
              {isSearching && (
                <SearchTrain
                  trainNumber={trainNumber}
                  onFetchSuccess={handleFetchSuccess}
                />
              )}
            </button>
          </div>
        </div>

        <div className="train-details-grid">
          <div className="form-group">
            <label>Train Name</label>
            <div className="input-icon-container">
              <input
                type="text"
                placeholder="Train Name"
                value={trainName}
                onChange={(e) => setTrainName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Departure Station</label>
            <div className="input-icon-container">
              <input
                type="text"
                placeholder="Departure Station"
                value={departureStation}
                onChange={(e) => setDepartureStation(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Destination Station</label>
            <div className="input-icon-container">
              <input
                type="text"
                placeholder="Destination Station"
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Number of Coaches</label>
            <div className="input-icon-container">
              <input
                type="number"
                placeholder="Number of Coaches"
                value={numberOfCoaches}
                onChange={handleNumberOfCoachesChange}
              />
            </div>
          </div>
        </div>

        <div className="coach-diagram">
          {coaches.map((coach) => (
            <span key={coach.id} className={`coach-icon ${coach.status}`}>
              {coach.displayId}
            </span>
          ))}
        </div>

        <div className="coach-legend">
          <span className="coach-icon configured"></span>
          <span>
            Configured (
            {coaches.filter((coach) => coach.status === "configured").length})
          </span>
          &nbsp; &nbsp; &nbsp;
          <span className="coach-icon unconfigured"></span>
          <span>
            Unconfigured (
            {coaches.filter((coach) => coach.status === "unconfigured").length})
          </span>
        </div>
      </div>

      <div className="coach-configuration">
        <h2>Coach Configuration</h2>
        <table className="coach-config-table">
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Display ID</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map((coach) => (
              <tr key={coach.id}>
                <td>
                  <input
                    type="text"
                    placeholder="Coach Unique ID"
                    value={coach.uniqueId}
                    onChange={(e) =>
                      updateCoach(coach.id, "uniqueId", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Coach Display ID"
                    value={coach.displayId}
                    onChange={(e) => {
                      const newDisplayId = e.target.value;
                      updateCoach(coach.id, "displayId", newDisplayId);
                      updateCoach(coach.id, "status", newDisplayId ? "configured" : "unconfigured");
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Position"
                    value={coach.position}
                    onChange={(e) =>
                      updateCoach(coach.id, "position", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    className="delete-coach-button"
                    onClick={() => removeCoach(coach.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-coach-button" onClick={addCoach}>
          Add
        </button>
      </div>

      <div className="actions">
        <button className=" save-button" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="saved-coaches">
        <h2>Train Records</h2>

        {loading && (
          <div className="loader">
            <p>Loading train records...</p>
            <div className="progress-bar">
              <div className="progress"></div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loader"></div>
        ) : (
          <>
            {currentRecords.length > 0 ? (
              <table className="saved-coach-table">
                <thead>
                  <tr>
                    <th>Train Number</th>
                    <th>Train Name</th>
                    <th>Departure</th>
                    <th>Destination</th>
                    <th>Coaches</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((savedCoach, index) => (
                    <tr key={index}>
                      <td>{savedCoach.train_number}</td>
                      <td>{savedCoach.train_name}</td>
                      <td>{savedCoach.departure_station}</td>
                      <td>{savedCoach.destination_station}</td>
                      <td>{savedCoach.number_of_coaches}</td>
                      <td>
                        <img
                          src={EditIcon}
                          alt="Edit"
                          className="action-icon"
                          onClick={() => handleEdit(savedCoach)}
                        />
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          className="action-icon"
                          onClick={() => deleteSavedCoach(index)}
                        />
                        <img
                          src={ViewIcon}
                          alt="View"
                          className="action-icon"
                          onClick={() => handleView(savedCoach)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No saved coaches yet.</p>
            )}
          </>
        )}
      </div>
{/* Pagination Controls */}
<div className="pagination">
  <button 
    onClick={handlePrevPage} 
    disabled={currentPage === 1}
  >
    Prev
  </button>
  
  <span>
    Page {currentPage} of {totalPages}
  </span>
  
  <button 
    onClick={handleNextPage} 
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

      {isEditing && (
        <EditTrain
          trainData={currentTrain}
          onSave={handleEditSave}
          onClose={() => setIsEditing(false)}
        />
      )}
      {isViewing && (
        <ViewTrain
          trainData={viewTrainData}
          onClose={() => setIsViewing(false)}
        />
      )}

      {fetchedTrainData && (
        <div className="modal">
          <div className="modal-content">
            <h2>Fetched Train Details</h2>
            <p><strong>Train Number:</strong> {fetchedTrainData.train_number}</p>
            <p><strong>Train Name:</strong> {fetchedTrainData.train_name}</p>
            <p><strong>Departure Station:</strong> {fetchedTrainData.departure_station}</p>
            <p><strong>Destination Station:</strong> {fetchedTrainData.destination_station}</p>
            <p><strong>Number of Coaches:</strong> {fetchedTrainData.number_of_coaches}</p>
            <p><strong>Line:</strong> {fetchedTrainData.line}</p>
            <p><strong>Created By:</strong> {fetchedTrainData.created_by}</p>
            <p><strong>Last Updated At:</strong> {fetchedTrainData.last_updated_at}</p>
            <p><strong>Created At:</strong> {fetchedTrainData.created_at}</p>
            <p><strong>Updated At:</strong> {fetchedTrainData.updated_at}</p>
            <button onClick={() => setFetchedTrainData(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainConfig;
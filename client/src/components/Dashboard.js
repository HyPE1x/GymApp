import React, {Fragment, useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { getRoutines, deleteRoutine } from "../api/routines";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Optional: for icons

const Dashboard = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");

  const [routines, setRoutines] = useState([]);

  const [expandedRoutineId, setExpandedRoutineId] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedRoutineId(prev => (prev === id ? null : id));
  };

  async function getName() {
    try {
        const response = await fetch("http://localhost:5000/dashboard/username", {
            method: "GET",
            headers: {token: localStorage.token}
        });

        const parseResponse = await response.json();

        //console.log(parseResponse);

        setName(parseResponse.user_name)

    } catch (err) {
        console.error(err.message);
    }
  }

  const fetchRoutines = async () => {
      try {
        const response = await getRoutines();
        setRoutines(response.routines || []);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    }
 
  const handleDelete = async (routine_id) => {
    try {
      const response = await deleteRoutine(routine_id);
      if (response.routine) {
        console.log("Routine deleted successfully:", response);
        setRoutines(routines.filter(routine => routine.routine_id !== routine_id));
      }
    } catch (error) {
      console.error("Error deleting routine:", error);
      
    }
  }

  const logout = async e => {
      e.preventDefault();
      try {
        localStorage.removeItem("token");
        setAuth(false);
      } catch (err) {
        console.error(err.message);
      }
  };

  useEffect(() => {
    getName();
    fetchRoutines();
  }, []);

  return (
    <Fragment>
      <div className="min-vh-100" style={{ background: "#f5f6fa" }}>
        <div className="container-fluid pt-4">
          <div className="d-flex justify-content-start align-items-start">
            <div style={{ width: "100%" }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="mb-2" style={{ color: "#343a40", fontSize: "2rem" }}>Home Page</h1>
                  <h2 className="mb-0" style={{ color: "#495057", fontSize: "1.25rem" }}>Welcome {name}</h2>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-dark"
                  style={{ zIndex: 10 }}
                >
                  Logout
                </button>
              </div>
              {routines.length > 0 ? (
              <div>
                <h4 style={{ color: "#343a40" }}>Your Routines:</h4>
                <div className="row">
                  {routines.map((routine) => (
                    <div key={routine.routine_id} className="col-12 mb-3">
                      <div className="card shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="card-title mb-1">{routine.routine_name}</h5>
                              <p className="card-text text-muted">{routine.routine_split}</p>
                            </div>
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-outline-danger btn-sm me-2"
                                onClick={() => handleDelete(routine.routine_id)}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => toggleExpanded(routine.routine_id)}
                              >
                                {expandedRoutineId === routine.routine_id ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </div>
                          </div>

                          {/* Expandable Days Section */}
                          {expandedRoutineId === routine.routine_id && routine.Days && (
                            <div className="d-flex gap-2 mt-3 px-2 overflow-auto">
                                {routine.Days.map((day, index) => (
                                  <div
                                    key={index}
                                    className="border rounded text-center"
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      flex: "0 0 auto",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: "#f8f9fa",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => navigate(`/routine/${routine.routine_id}/${day.day_name}`)}
                                  >
                                    {day.day_name}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 text-muted">No routines found.</div>
            )}
              <div className="mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/new_routine", {state : { backgroundLocation: location }})}
                >
                  Create New Routine
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
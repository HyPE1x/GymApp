import React, {Fragment, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"
import { getRoutines, deleteRoutine } from "../api/routines";

const Dashboard = ({setAuth}) => {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [routines, setRoutines] = useState([]);

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
                <ul className="list-group">
                  {routines.map((routine) => (
                    <li
                      key={routine.routine_id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        <strong>{routine.routine_name}</strong> &mdash; {routine.routine_split}
                      </span>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(routine.routine_id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 text-muted">No routines found.</div>
            )}
            <div className="mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/new_routine")}
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
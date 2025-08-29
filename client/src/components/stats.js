import React, {Fragment, useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom"
import {getAllExercisesForUserSets} from "../api/logging";


const Stats = ({setAuth}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [loggedExercises, setLoggedExercises] = useState([]);

    const fetchExercises = async () => {
        try {
            const exercises = await getAllExercisesForUserSets();
            setLoggedExercises(exercises);
            //console.log(exercises);
        } catch (error) {
            console.error("Error fetching exercises", error);
        }
    }

    useEffect(() => {
        fetchExercises();
    }, []);

    return (
        <Fragment>
            <div className="min-vh-100" style={{ background: "#f5f6fa" }}>
                <div className="container-fluid pt-4">
                    <div className="d-flex justify-content-start align-items-start">
                        <div style={{ width: "100%" }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h1 className="mb-2" style={{ color: "#343a40", fontSize: "2rem" }}>Recorded Exercises</h1>
                                </div>
                                <button className="btn btn-dark btn-sm me-2"
                                    onClick={() => navigate(`/dashboard`)}
                                    style={{ zIndex: 10 }}
                                >
                                    Back
                                </button>
                            </div>
                            <div>
                                <ul>
                                {loggedExercises.length > 0 ? 
                                    (loggedExercises.map((exercise) => (
                                        <div key={exercise.exercise_id} className="col-12 mb-3"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => navigate(`/stats/${exercise.exercise_id}`, {state : { backgroundLocation: location }})}
                                        >
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h5 className="card-title mb-1">{exercise.exercise_name}</h5>
                                                            <p className="mb-0 text-muted">{exercise.muscle_group} | {exercise.muscle_head}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No exercises logged</p>
                                )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Stats;
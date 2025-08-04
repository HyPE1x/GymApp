import React, {Fragment, useState, useEffect, useCallback} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getDayExercises} from "../api/routines";

const RoutineDay = ({ setAuth }) => {
    const navigate = useNavigate();
    const { routine_id, routine_day } = useParams();

    const [dayExercises, setDayExercises] = useState([]);

    const fetchExercises = useCallback(async () => {
        try {
            const response = await getDayExercises(routine_id, routine_day)
            console.log("Selected Exercises:", response);
            setDayExercises(response || []);

        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    }, [routine_id, routine_day])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    return (
        <Fragment>
            <div className="min-vh-100" style={{ background: "#f5f6fa" }}>
                <div className="container-fluid pt-4">
                    <div className="d-flex justify-content-start align-items-start">
                        <div style={{ width: "100%" }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h1 className="mb-2" style={{ color: "#343a40", fontSize: "2rem" }}>{routine_day} Day</h1>
                                    <h2 className="mb-0" style={{ color: "#495057", fontSize: "1.25rem" }}>Your Exercises:</h2>
                                </div>
                                <div className="d-flex justify-content-end mb-4">
                                    <button
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={() => navigate(`/routine/${routine_id}/${routine_day}/edit`)}
                                        style={{ zIndex: 10 }}
                                    >
                                        Edit Day
                                    </button>
                                    <button
                                        className="btn btn-dark btn-sm"
                                        onClick={() => navigate(`/dashboard`)}
                                        style={{ zIndex: 10 }}
                                    >
                                        Home
                                    </button>
                                </div>
                            </div>
                            {dayExercises.length > 0 ? (
                                dayExercises.map((exercise) => (
                                    <div key={exercise.exercise_id} className="mb-3 p-3 bg-white shadow-sm rounded">
                                        <h5 className="mb-1">{exercise.exercise_name}</h5>
                                        <p className="mb-0 text-muted">
                                            {exercise.muscle_group} | {exercise.muscle_head}
                                        </p>
                                        <p className="mb-0 text-muted">
                                            Sets: {exercise.sets}
                                        </p>
                                        <p className="mb-0 text-muted">
                                            Reps: {exercise.rep_range_min} - {exercise.rep_range_max}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No exercises selected</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default RoutineDay;
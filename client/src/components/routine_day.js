import React, {Fragment, useState, useEffect, useCallback} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getDayExercises, getRoutineDay, setCurrentDay} from "../api/routines";
import { generateTips } from "../helper/tips";

const RoutineDay = ({ setAuth }) => {
    const navigate = useNavigate();
    const { routine_id, routine_day } = useParams();

    const [dayExercises, setDayExercises] = useState([]);

    const [tips, setTips] = useState([]);

    const[isCurrent, setIsCurrent] = useState(false);

    const fetchExercises = useCallback(async () => {
        try {
            const response = await getDayExercises(routine_id, routine_day);
            setDayExercises(response || []);

        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    }, [routine_id, routine_day])

    const fetchTips = async () => {
        try {
            const result = generateTips(routine_day, dayExercises);
            setTips(result);
        } catch (error) {
            console.error("Error fetching tips:", error);
        }
    }

    const handleIsCurrentDay = async () => {
        try {
            const response = await getRoutineDay(routine_id, routine_day);
            setIsCurrent(response.is_current);
        } catch (error) {
            console.error("Error getting current day:", error);
        }
    }

    const handleFinishDay = async () => {
        try {
            const result = setCurrentDay(routine_id);
            console.log("Day is finished. Next day is:", result.new);
            window.location.reload();
        } catch (error) {
            console.error("Error setting current day:", error);
        }
    }

    

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchExercises();
        handleIsCurrentDay();
    }, [fetchExercises]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchTips();
    }, [dayExercises, routine_day])

    return (
        <Fragment>
            <div className="min-vh-100" style={{ background: "#f5f6fa" }}>
                <div className="container-fluid pt-4">
                    <div className="d-flex justify-content-start align-items-start">
                        <div style={{ width: "100%" }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h1 className="mb-2" style={{ color: "#343a40", fontSize: "2rem" }}>{routine_day} Day</h1>
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
                            <div>
                                <h5 className="mb-2" style={{ color: "#343a40", fontSize: "1.5rem" }}>Your Exercises</h5>
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
                            {isCurrent && (
                                <button
                                    className="btn btn-success fw-bold"
                                    onClick={handleFinishDay}
                                >
                                    ✅ Finish Day
                                </button>
                            )}
                            {tips.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                    <h5 className="mb-2" style={{ color: "#343a40", fontSize: "1.5rem" }}>Selection Tips</h5>
                                    {tips.map((tip, index) => (
                                    <div
                                        key={index}
                                        style={{
                                        backgroundColor: '#f0b943ff',    
                                        border: '1px solid #f8f6f1ff',   
                                        color: '#0c0c0bff',              
                                        fontWeight: 'bold',
                                        padding: '12px 16px',
                                        borderRadius: '5px',
                                        marginBottom: '10px',          
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        {tip}
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default RoutineDay;
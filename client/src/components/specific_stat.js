import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {getExerciseByID} from "../api/routines";
import { getSetsByExercise } from "../api/logging";
import { FaTimes } from "react-icons/fa";


const SpecificStat = () => {
    
    const navigate = useNavigate();
    const { exercise_id } = useParams();
    const [exerciseName, setExerciseName] = useState("");
    const [exerciseSets, setExerciseSets] = useState([]);

    const fetchExerciseName = async () => {
        try {
            const name = await getExerciseByID(exercise_id);
            setExerciseName(name.exercise_name);
        } catch (error) {
            console.error("Error fetching exercise name:", error);
        }
    }

    const fetchExerciseSets = async () => {
        try {
            const sets = await getSetsByExercise(exercise_id);
            //console.log(sets);
            setExerciseSets(sets);
        } catch (error) {
           console.error("Error fetching exercise sets:", error); 
        }
    }

    useEffect(() => {
        fetchExerciseName();
        fetchExerciseSets();
    }, [exercise_id]);
    
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="card shadow p-4" style={{ minWidth: "350px", background: "#fff" }}>
                <button
                    className="btn btn-sm btn-light position-absolute"
                    style={{ top: "10px", right: "10px" }}
                    onClick={() => navigate(`/stats`)}
                >
                    <FaTimes size={15}/>
                </button>
                <h1>{exerciseName} Stats:</h1>
                {exerciseSets.length > 0 ? (
                    <ul className="list-group mt-3">
                        {exerciseSets.map((set) => (
                            <li key={set.set_id} className="list-group-item">
                                <strong>Date:</strong> {new Date(set.workout_date).toLocaleDateString()} | <strong>Set</strong> {set.set_number} | <strong>Reps:</strong> {set.reps} | <strong>Weight:</strong> {set.weight} lbs
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3">No sets logged for this exercise.</p>
                )}
            </div>
        </div>
    );
}

export default SpecificStat;
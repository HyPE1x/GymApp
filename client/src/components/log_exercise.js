import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { createSet } from "../api/logging";
import { getExerciseByID, getSpecificDayExercise } from "../api/routines";

const LogExercise = ({setAuth}) => {

    const navigate = useNavigate();
    const { routine_id, routine_day, exercise_id, session_id } = useParams();
    const [ExerciseName, setExerciseName] = useState("");
    const [numSets, setNumSets] = useState(null);
    const [routineExerciseID, setRoutineExerciseID] = useState(null);
    const [sets, setSets] = useState([]);

    const getExerciseDetails = async () => {
        try {
            const name = await getExerciseByID(exercise_id);
            setExerciseName(name.exercise_name);

            const details = await getSpecificDayExercise(routine_id, routine_day, exercise_id);
            setNumSets(details.sets);
            setRoutineExerciseID(details.routine_exercise_id);

        } catch (error) {
            console.error("Error getting name:", error);
        }
    }

    const handleChange = (index, field, value) => {
        setSets((prev) =>
            prev.map((set, i) =>
            i === index ? { ...set, [field]: value } : set
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            for (let i = 0; i < sets.length; i++) {
                const set = sets[i];
                const set_number = i + 1; 
                await createSet(session_id, routineExerciseID, set_number, set.reps, parseFloat(set.weight));
            }
            navigate(`/routine/${routine_id}/${routine_day}`);
        } catch (error) {
            console.error("Error logging sets:", error);
        }
    }

    useEffect(() => {
       getExerciseDetails();
    }, [])

    useEffect(() => {
        if (numSets) {
            setSets(
                Array.from({ length: numSets }, () => ({
                    reps: "",
                    weight: "",
                }))
            );
        }
    }, [numSets]);

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="card shadow p-4" style={{ minWidth: "350px", background: "#fff" }}>
                <button
                    className="btn btn-sm btn-light position-absolute"
                    style={{ top: "10px", right: "10px" }}
                    onClick={() => navigate(`/routine/${routine_id}/${routine_day}`)}
                >
                    &times;
                </button>
                <h1>{ExerciseName}</h1>

                <form onSubmit={handleSubmit}>
                    {sets.map((set, index) => (
                        <div key={index} className="mb-3 border-bottom pb-2">
                        <h6>Set {index+1}</h6>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Weight"
                                    value={set.weight}
                                    onChange={(e) => handleChange(index, "weight", e.target.value)}
                                    required
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Reps"
                                    value={set.reps}
                                    onChange={(e) => handleChange(index, "reps", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary w-100">
                        Log Sets
                    </button>
                </form>
            </div>
        </div>
    )

}

export default LogExercise;
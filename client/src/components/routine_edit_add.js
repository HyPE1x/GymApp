import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { addExerciseToDay, getExerciseByID } from "../api/routines";
import { FaTimes } from "react-icons/fa";

const RoutineEditAdd = ({setAuth}) => {
    
    const navigate = useNavigate();

    const {routine_id, routine_day, exercise_id} = useParams();

    const[exerciseName, setExerciseName] = useState("")

    const [inputs, setInputs] = useState({
            sets: "",
            rep_range_min: "",
            rep_range_max: ""
    });

    const { sets, rep_range_min, rep_range_max } = inputs;

    async function getExerciseName(id) {
        const response = await getExerciseByID(id);
        setExerciseName(response.exercise_name);
    }

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value});
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await addExerciseToDay(routine_id, routine_day, exercise_id, sets, rep_range_min, rep_range_max);

            if(response.results){
                navigate(`/routine/${routine_id}/${routine_day}/edit`);
                window.location.reload();
                console.log("Exercise sucessfully added:", response.results);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    useEffect(() => {
        getExerciseName(exercise_id);
    }, [exercise_id])

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="card shadow p-4" style={{ minWidth: "350px", background: "#fff" }}>
                <button
                    className="btn btn-sm btn-light position-absolute"
                    style={{ top: "10px", right: "10px" }}
                    onClick={() => navigate(`/routine/${routine_id}/${routine_day}/edit`)}
                >
                    <FaTimes size={15}/>
                </button>
                <h1 className="text-center mb-4" style={{ color: "#343a40" }}>Add {exerciseName}</h1>
                <form onSubmit={onSubmitForm}>
                    <div className="mb-3">
                        <label htmlFor="sets" className="form-label">Sets</label>
                        <input
                        type="number"
                        className="form-control"
                        id="sets"
                        name="sets"
                        onChange={onChange}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rep_range_min" className="form-label">Minimum Reps</label>
                        <input
                        type="number"
                        className="form-control"
                        id="rep_range_min"
                        name="rep_range_min"
                        onChange={onChange}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rep_range_max" className="form-label">Maximum Reps</label>
                        <input
                        type="number"
                        className="form-control"
                        id="rep_range_max"
                        name="rep_range_max"
                        onChange={onChange}
                        required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default RoutineEditAdd;

import React, {Fragment, useState, useEffect, useCallback, useMemo} from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSpecificExercises, getDayExercises, deleteExerciseFromDay } from '../api/routines';

const muscleGroupMap = {
    "Push": ["Chest", "Shoulders", "Triceps"],
    "Pull": ["Back", "Biceps"],
    "Legs": ["Quads", "Glutes", "Hamstrings", "Calves"],
    "Chest-Back": ["Chest", "Back"],
    "Shoulders-Arms": ["Shoulders", "Arms"],
    "Chest-Shoulders": ["Chest", "Shoulders"],
    "Back": ["Back"],
    "Arms": ["Biceps", "Triceps"]
};

const RoutineDayEdit = ({ setAuth }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { routine_id, routine_day } = useParams();

    const [exercises, setExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([])


    const muscleGroups = useMemo(() => {
        return muscleGroupMap[routine_day] || [];
    }, [routine_day]);

    const fetchExercises = useCallback(async () => {
        try {
            const exercises = await getSpecificExercises(muscleGroups);
            setExercises(exercises.exercises);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    }, [muscleGroups])

    const fetchSelectedExercises = useCallback(async () => {
            try {
                const response = await getDayExercises(routine_id, routine_day)
                setSelectedExercises(response || []);
                
            } catch (error) {
                console.error("Error fetching selected exercises:", error);
            }
        }, [routine_id, routine_day])

    const groupedExercises = exercises.reduce((groups, exercise) => {
        const group = exercise.muscle_group;
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(exercise);
        return groups;
    }, {});

    const handleDelete = async (routine_id, day_id, exercise_id) => {
        try {
          const response = await deleteExerciseFromDay(routine_id, day_id, exercise_id);
          if (response.results) {
            console.log("Exercise deleted successfully:", response);
            setSelectedExercises(selectedExercises.filter(selectedExercises => selectedExercises.exercise_id !== exercise_id));
          }
        } catch (error) {
          console.error("Error deleting routine:", error);
          
        }
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchExercises();
        fetchSelectedExercises();
    }, [fetchExercises, fetchSelectedExercises]);
    

    return (
        <Fragment>
            <div className="min-vh-100" style={{ background: "#f5f6fa" }}>
                <div className="container-fluid pt-4">
                    <div className="d-flex justify-content-start align-items-start">
                        <div style={{ width: "100%" }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h1 className="mb-2" style={{ color: "#343a40", fontSize: "2rem" }}>Edit {routine_day} Day</h1>
                                    <h2 className="mb-0" style={{ color: "#495057", fontSize: "1.25rem" }}>Select exercises for {routine_day} Day</h2>
                                </div>
                                <button className="btn btn-dark btn-sm me-2"
                                    onClick={() => navigate(`/routine/${routine_id}/${routine_day}`)}
                                    style={{ zIndex: 10 }}
                                >
                                    Back
                                </button>
                            </div>
                            <div>
                                {Object.entries(groupedExercises).map(([muscleGroup, exList]) => (
                                    <div key={muscleGroup}>
                                        <h3 className="mb-1" style={{ color: "#495057", fontSize: "1.25rem" }}>{muscleGroup}</h3>
                                        <ul>
                                        {exList.map((exercise) => (
                                            <div key={exercise.exercise_id} className="col-12 mb-3">
                                                <div className="card shadow-sm">
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h5 className="card-title mb-1">{exercise.exercise_name}</h5>
                                                                <p className="card-text text-muted">{exercise.muscle_head}</p>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => navigate(`/routine/${routine_id}/${routine_day}/edit/add/${exercise.exercise_id}`, {state : { backgroundLocation: location }})}
                                                                >
                                                                    Add To Routine
                                                                </button>        
                                                            </div>
                                                        </div>                                         
                                                    </div>
                                                </div>       
                                            </div>                                     
                                        ))}
                                        </ul>
                                    </div>
                                ))}
                                <h3 className="mb-1" style={{ color: "#495057", fontSize: "1.25rem" }}>Selected Exercises</h3>
                                <ul>
                                {selectedExercises.length > 0 ? 
                                    (selectedExercises.map((exercise) => (
                                        <div key={exercise.exercise_id} className="col-12 mb-3">
                                            <div className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h5 className="card-title mb-1">{exercise.exercise_name}</h5>
                                                            <p className="card-text text-muted">{exercise.muscle_head}</p>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <button
                                                                className="btn btn-outline-danger btn-sm me-2"
                                                                onClick={() => handleDelete(routine_id, routine_day, exercise.exercise_id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No exercises selected</p>
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

export default RoutineDayEdit;
import React, {Fragment, useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { getSpecificExercises } from '../api/routines';

const RoutineDayEdit = ({ setAuth }) => {

    const { routine_id, routine_day } = useParams();

    const [exercises, setExercises] = useState([]);

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
    const muscleGroups = muscleGroupMap[routine_day] || [];

    const fetchExercises = async () => {
        try {
            const exercises = await getSpecificExercises(muscleGroups);
            setExercises(exercises.exercises);
            console.log("Fetched exercises:", exercises);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    }

    const groupedExercises = exercises.reduce((groups, exercise) => {
        const group = exercise.muscle_group;
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(exercise);
        return groups;
    }, {});

    useEffect(() => {
        fetchExercises();
    });
    

    return (
        <Fragment>
            <div className="min-vh-100" style={{ background: "#f5f6fa" }}>
                <div className="container-fluid pt-4">
                    <div className="d-flex justify-content-start align-items-start">
                        <div style={{ width: "100%" }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h1 className="mb-2" style={{ color: "#343a40", fontSize: "2rem" }}>{routine_day} Day</h1>
                                    <h2 className="mb-0" style={{ color: "#495057", fontSize: "1.25rem" }}>Select exercises for {routine_day} Day</h2>
                                </div>
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
                                                        </div>                                                   
                                                    </div>
                                                </div>       
                                            </div>                                     
                                        ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default RoutineDayEdit;
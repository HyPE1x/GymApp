import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {getExerciseByID} from "../api/routines";
import { getSetsByExercise } from "../api/logging";
import { FaTimes } from "react-icons/fa";
//import {Chart as ChartJS} from 'chart.js/auto';
import { Line } from 'react-chartjs-2';


const SpecificStat = () => {
    
    const navigate = useNavigate();
    const { exercise_id } = useParams();
    const [exerciseName, setExerciseName] = useState("");
    const [exerciseSets, setExerciseSets] = useState([]);
    const [dayVolumes, setDayVolumes] = useState([]);

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

    const calculateDayVolume = () => {
        try {
            const volumesByDate = {};

            exerciseSets.forEach((set) => {
                const dateKey = new Date(set.workout_date).toISOString().split("T")[0];
                if (!volumesByDate[dateKey]) {
                    volumesByDate[dateKey] = { volume: 0, sets: [] };
                }

                const weight = Number(set.weight);
                if(weight === 0) {
                    volumesByDate[dateKey].volume  += set.reps;
                }
                else{
                    volumesByDate[dateKey].volume  += set.weight * set.reps;
                }

                volumesByDate[dateKey].sets.push({
                    set_number: set.set_number,
                    weight: set.weight,
                    reps: set.reps,
                });
            });

            // Convert to array, reformat, and sort by date
            const dayVolumeArray = Object.entries(volumesByDate).map(([dateKey, volume]) => ({
                    date: new Date(dateKey).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }),
                    volume: volumesByDate[dateKey].volume,
                    sets: volumesByDate[dateKey].sets,
                }));
            dayVolumeArray.sort((a, b) => new Date(a.date) - new Date(b.date));

            //console.log(dayVolumeArray);
            setDayVolumes(dayVolumeArray);

        } catch (error) {
           console.error("Error calculating volumes:", error);  
        }
    }

    useEffect(() => {
        fetchExerciseName();
        fetchExerciseSets();;
    }, [exercise_id]);

    useEffect(() => {
        calculateDayVolume();
    }, [exerciseSets]);
    
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="card shadow p-4" style={{ width: "1000px", maxWidth: "90%", background: "#fff" }}>
                <button
                    className="btn btn-sm btn-light position-absolute"
                    style={{ top: "10px", right: "10px" }}
                    onClick={() => navigate(`/stats`)}
                >
                    <FaTimes size={15}/>
                </button>
                <h1>{exerciseName} Stats:</h1>
                {exerciseSets.length > 0 ? (
                    <Line 
                        data={{
                            labels: dayVolumes.map((dv) => dv.date),
                            datasets: [
                                {
                                    label: 'Total Day Volume',
                                    data: dayVolumes.map((dv) => dv.volume),
                                    fill: false,
                                    backgroundColor: 'rgba(75,192,192,0.4)',
                                    borderColor: 'rgba(75,192,192,1)',
                                }
                            ]
                        }}
                        options = {{
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            const dv = dayVolumes[context.dataIndex];

                                            const setsInfo = dv.sets.map(set => `Set ${set.set_number}: ${set.weight} x ${set.reps}`);
                                            return [`Total Volume: ${dv.volume}`, ...setsInfo];
                                        }
                                    }
                                }
                            }
                        }}
                    />
                ) : (
                    <p className="mt-3">No sets logged for this exercise.</p>
                )}
            </div>
        </div>
    );
}

export default SpecificStat;
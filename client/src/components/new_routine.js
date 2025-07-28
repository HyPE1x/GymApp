import React, {Fragment, useState} from "react";
import { newRoutine } from "../api/routines";
import { useNavigate } from 'react-router-dom';

const NewRoutine = ({setAuth}) => {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        routine_name: "",
        routine_split: "",
    });

    const { routine_name, routine_split } = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value})
    };

    const onsubmitForm = async (e) => {
        e.preventDefault();
        try {
            
            const response = await newRoutine(routine_name, routine_split, localStorage.token)

            if(response.routine){
                console.log("Routine created successfully:", response.routine);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }



    }

    return (
        <Fragment>
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#f5f6fa" }}>
                <div className="card shadow p-4" style={{ minWidth: "350px", background: "#fff" }}>
                    <h1 className="text-center mb-4" style={{ color: "#343a40" }}>New Routine</h1>
                    <form onSubmit={onsubmitForm}>
                        <input
                            type="text"
                            name="routine_name"
                            placeholder="Routine Name"
                            className="form-control mb-3"
                            value={routine_name}
                            onChange={onChange}
                            required
                        />
                        <select
                            name="routine_split"
                            className="form-select mb-3"
                            value={routine_split}
                            onChange={onChange}
                            required
                        >
                            <option value="">Select Split</option>
                            <option value="PPL">PPL</option>
                            <option value="Arnold Split">Arnold Split</option>
                            <option value="Bro Split">Bro Split</option>
                        </select>
                        <button className="btn btn-success w-100" type="submit">
                            Create Routine
                        </button>
                    </form>
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/dashboard")}
                            type="button"
                        >
                            Home
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default NewRoutine;
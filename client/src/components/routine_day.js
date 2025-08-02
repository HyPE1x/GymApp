//import React, {Fragment, useState, useEffect} from "react";
import { useParams, useNavigate} from 'react-router-dom';

const RoutineDay = ({ setAuth }) => {
    const navigate = useNavigate();
    const { routine_id, routine_day } = useParams();

    return (
        <div>
            <h1>{routine_day} Day</h1>
            <button className="btn btn-danger btn-sm me-2"
                onClick={() => navigate(`/routine/${routine_id}/${routine_day}/edit`)}>Edit Day</button>
        </div>
    );
}

export default RoutineDay;
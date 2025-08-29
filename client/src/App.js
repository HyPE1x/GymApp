import React,{Fragment, useState, useEffect} from 'react';
import {Route, Routes, Navigate, useLocation} from "react-router-dom";
import './App.css';

//Components
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import NewRoutine from './components/new_routine';
import RoutineDay from './components/routine_day';
import RoutineDayEdit from './components/routine_edit';
import RoutineEditAdd from './components/routine_edit_add';
import LogExercise from './components/log_exercise';
import Stats from './components/stats';
import SpecificStat from './components/specific_stat';

function App() {

  const location = useLocation();
  const state = location.state || {};

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth(){
    try {
      
      const response = await fetch("http://localhost:5000/auth/verify", {
        method: "GET",
        headers: {token: localStorage.token}
      });

      const parseResponse = await response.json();

      if(parseResponse === true){
        setIsAuthenticated(true);
      } else{
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    isAuth();
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="container">
        <Routes location={state.backgroundLocation || location}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />} />
          <Route path='/routine/:routine_id/:routine_day' element={isAuthenticated ? <RoutineDay setAuth={setAuth} /> : <Navigate to="/login" />} />
          <Route path='/routine/:routine_id/:routine_day/edit' element={isAuthenticated ? <RoutineDayEdit setAuth={setAuth} /> : <Navigate to="/login" />} />
          <Route path="/stats" element={isAuthenticated ? <Stats setAuth={setAuth} /> : <Navigate to="/login" />} />
        </Routes>
        {state.backgroundLocation && (
          <Routes>
            <Route path="/new_routine" element={<NewRoutine setAuth={setAuth} />} />
            <Route path='/routine/:routine_id/:routine_day/edit/add/:exercise_id/' element={<RoutineEditAdd setAuth={setAuth} />} />
            <Route path='/routine/:routine_id/:routine_day/:session_id/:exercise_id/' element={<LogExercise setAuth={setAuth} />} />
            <Route path="/stats/:exercise_id" element={isAuthenticated ? <SpecificStat setAuth={setAuth} /> : <Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Fragment>
  );
}

export default App;

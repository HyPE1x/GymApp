import React, {Fragment, useState} from "react";
//import {Link} from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const Register = ({setAuth}) => {

  const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: ""
    });

    const {username, email, password} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value})
    };
    
    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = {username, email, password};
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            const parseResponse = await response.json();
            console.log(parseResponse);
            if(parseResponse.token){
                localStorage.setItem("token", parseResponse.token);
                setAuth(true);
            }
            else{
                setAuth(false);
            }
        } catch (err) {
            console.error(err.message);
        }
    };


  return (
    <Fragment>
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#f5f6fa" }}>
        <div className="card shadow p-4" style={{ minWidth: "350px", background: "#fff" }}>
          <h1 className="text-center mb-4" style={{ color: "#343a40" }}>Register</h1>
          <form onSubmit={onSubmitForm}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-control my-3"
              value={username}
              onChange={e => onChange(e)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control my-3"
              value={email}
              onChange={e => onChange(e)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control my-3"
              value={password}
              onChange={e => onChange(e)}
              required
            />
            <button className="btn btn-dark w-100">Submit</button>
          </form>
          <div className="text-center mt-3">
            <span style={{ color: "#6c757d" }}>
              Already have an account? <a href="/login" className="text-primary">Return to Login</a>
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
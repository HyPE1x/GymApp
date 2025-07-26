import React, {Fragment, useState} from "react";
const Login = ({setAuth}) => {

  const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const {email, password} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const onSubmitForm = async(e) => {
        e.preventDefault()

        try {

            const body = {email, password};

            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            const parseResponse = await response.json();

            

            if(parseResponse.token){
                localStorage.setItem("token", parseResponse.token);
                setAuth(true);
            }
            else{
                setAuth(false);
            }

        } catch (err) {
            console.log(err.message);
          
        }
    }


  return (
   <Fragment>
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "#f5f6fa" }}>
        <div className="card shadow p-4" style={{ minWidth: "350px", background: "#fff" }}>
          <h1 className="text-center mb-4" style={{ color: "#343a40" }}>Login</h1>
          <form onSubmit={onSubmitForm}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={e => onChange(e)}
              className="form-control my-3"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={e => onChange(e)}
              className="form-control my-3"
              required
            />
            <button className="btn btn-dark w-100">Submit</button>
          </form>
          <div className="text-center mt-3">
            <span style={{ color: "#6c757d" }}>
              Don't have an account? <a href="/register" className="text-primary">Register Here</a>
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
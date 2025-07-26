import React, {Fragment, useState, useEffect} from "react";

const Dashboard = ({setAuth}) => {

  const [name, setName] = useState("");

  async function getName() {
    try {
        const response = await fetch("http://localhost:5000/dashboard/username", {
            method: "GET",
            headers: {token: localStorage.token}
        });

        const parseResponse = await response.json();

        console.log(parseResponse);

        setName(parseResponse.user_name)

    } catch (err) {
        console.error(err.message);
    }
  }

  const logout = async e => {
      e.preventDefault();
      try {
        localStorage.removeItem("token");
        setAuth(false);
      } catch (err) {
        console.error(err.message);
      }
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <Fragment>
      <div className="min-vh-100" style={{ background: "#f5f6fa" }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-start align-items-start pt-4">
            <div>
              <h1 className="mb-2" style={{ color: "#343a40", fontSize: "2rem" }}>Home Page</h1>
              <h2 className="mb-4" style={{ color: "#495057", fontSize: "1.25rem" }}>Welcome {name}</h2>
              <button onClick={logout} className="btn btn-dark w-100">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
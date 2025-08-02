export const newRoutine = async (routine_name, routine_split) => {
    try {
        
        const body = { routine_name, routine_split };
        const response = await fetch("http://localhost:5000/routines/create", {
            method: "POST",
            headers: {"Content-Type": "application/json", token: localStorage.token},
            body: JSON.stringify(body)
        });

        const parseResponse = await response.json();

        return parseResponse;
        
    } catch (error) {
        console.error("Error creating new routine:", error);
    }
}

export const getRoutines = async() => {
    try {
      const response = await fetch("http://localhost:5000/routines/", {
        method: "GET",
        headers: {token: localStorage.token}
    });

    const parseResponse = await response.json();
    return parseResponse;

    } catch (error) {
      console.error(error.message);
    }
  }

  export const deleteRoutine = async (routine_id) => {
    try {
      const response = await fetch(`http://localhost:5000/routines/delete/${routine_id}`, {
        method: "DELETE",
        headers: {token: localStorage.token}
      });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  }

  export const getAllExercises = async () => {
    try {
        const response = await fetch("http://localhost:5000/routines/exercises/", {
            method: "GET",
            headers: {token: localStorage.token}
        });

        const parseResponse = await response.json();
        return parseResponse;

    } catch (error) {
        console.error("Error fetching exercises:", error);
    }
  }

  export const getSpecificExercises = async (muscleGroups) => {
    try {
        const query = muscleGroups.join(",");
        const response = await fetch(`http://localhost:5000/routines/exercises?muscleGroups=${query}`, {
            method: "GET",
            headers: {token: localStorage.token}
        });
        const parseResponse = await response.json();
        return parseResponse;

    } catch (error) {
        console.error("Error fetching specific exercises:", error);
    }
  }
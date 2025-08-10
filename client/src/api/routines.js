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

  export const setActiveRoutine = async (routine_id) => {
    try {
      const body = { routine_id };
      const response = await fetch("http://localhost:5000/routines/active/", {
        method: "PUT",
        headers: {"Content-Type": "application/json", token: localStorage.token},
        body: JSON.stringify(body)
      });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
      console.error("Error setting routine as active:", error);
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

  export const getExerciseByID = async (exercise_id) => {
    try {
      const response = await fetch(`http://localhost:5000/routines/exercises/${exercise_id}`, {
            method: "GET",
            headers: {token: localStorage.token}
      });
      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
      console.error("Error fetching exercise:", error);
    }
  }

  export const addExerciseToDay = async (routine_id, day_name, exercise_id, sets, rep_range_min, rep_range_max) => {
    try {
      const body = {routine_id, day_name, exercise_id, sets, rep_range_min, rep_range_max};
      const response = await fetch("http://localhost:5000/routines/day/add", {
            method: "POST",
            headers: {"Content-Type": "application/json", token: localStorage.token},
            body: JSON.stringify(body)
      });
      
      const parseResponse = await response.json();
      return parseResponse;
    } catch (error) {
      console.error("Error adding exercise to day:", error);
    }
  }

  export const deleteExerciseFromDay = async (routine_id, day_name, exercise_id) => {
    try {
      const body = { routine_id, day_name, exercise_id };
      const response = await fetch(`http://localhost:5000/routines/day/delete`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json", token: localStorage.token},
        body: JSON.stringify(body)
      });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
      console.error("Error deleting exercise from day:", error);
    }
  }

  export const getDayExercises = async (routine_id, day_name) => {
    try {
      //Get relevant rows from routine_exercises
      const dayNameEncoded = encodeURIComponent(day_name);
      const response = await fetch(`http://localhost:5000/routines/${routine_id}/${dayNameEncoded}`, {
            method: "GET",
            headers: {token: localStorage.token}
      });

      const baseExercises = await response.json();

      //Check for valid array
      if (!Array.isArray(baseExercises)) {
        console.error("Expected an array of exercises");
        return [];
      }

      const enrichedExercises = await Promise.all(
        baseExercises.map(async (exercise) => {
          const fullDetails = await getExerciseByID(exercise.exercise_id);
          return {
            ...exercise,
            ...fullDetails,
          };
        })
      );

      return enrichedExercises;
    } catch (error) {
      console.error("Error getting day exercises:", error);
    }
  }
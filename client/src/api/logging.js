export const createSession = async (routine_day_id) => {
    try {
        const body = { routine_day_id };
        const response = await fetch("http://localhost:5000/logging/session/create", {
            method: "POST",
            headers: {"Content-Type": "application/json", token: localStorage.token},
            body: JSON.stringify(body)
        });

        const parseResponse = await response.json();
        return parseResponse;

    } catch (error) {
        console.error("Error creating new session:", error);
    }
}

export const getSession = async (session_id) => {
    try {
        const response = await fetch(`http://localhost:5000/logging/session/id/${session_id}`, {
            method: "GET",
            headers: {token: localStorage.token}
        });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
        console.error("Error getting session:", error);
    }
}

export const getSessionsByDay = async (routine_day_id) => {
    try {
        const response = await fetch(`http://localhost:5000/logging/session/day/${routine_day_id}`, {
            method: "GET",
            headers: {token: localStorage.token}
        });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
        console.error("Error getting session:", error);
    }
}

export const endSession = async (session_id) => {
    try {
        const response = await fetch(`http://localhost:5000/logging/session/end/${session_id}`, {
            method: "PUT",
            headers: {token: localStorage.token}
        });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
        console.error("Error getting session:", error);
    }
}

export const createSet = async (session_id, routine_exercise_id, set_number, reps, weight) => {
    try {
        const body = { session_id, routine_exercise_id, set_number, reps, weight };
        const response = await fetch("http://localhost:5000/logging/set/create", {
            method: "POST",
            headers: {"Content-Type": "application/json", token: localStorage.token},
            body: JSON.stringify(body)
        });

        const parseResponse = await response.json();
        return parseResponse;

    } catch (error) {
        console.error("Error creating set:", error);
    }
}

export const getSetsInSession = async (session_id) => {
    try {
        const response = await fetch(`http://localhost:5000/logging/set/session/${session_id}`, {
            method: "GET",
            headers: {token: localStorage.token}
        });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
        console.error("Error getting sets:", error);
    }
}

export const getSetsByExercise = async (exercise_id) => {
    try {
        const response = await fetch(`http://localhost:5000/logging/set/exercise/${exercise_id}`, {
            method: "GET",
            headers: {token: localStorage.token}
        });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
        console.error("Error getting sets:", error);
    }
}

export const getSetByID = async (set_id) => {
    try {
        const response = await fetch(`http://localhost:5000/logging/set/${set_id}`, {
            method: "GET",
            headers: {token: localStorage.token}
        });

      const parseResponse = await response.json();
      return parseResponse;

    } catch (error) {
        console.error("Error getting sets:", error);
    }
}
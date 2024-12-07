const fetchTable = async (path, token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while making get req:", error);
  }
};

export const getRoutes = async (token) => {
  const data = fetchTable("/route", token);
  return data;
};

export const getBuses = async (token) => {
  const data = fetchTable("/bus", token);
  return data;
};

export const getStudents = async (token) => {
  const data = fetchTable("/student", token);
  return data;
};

export const getAvailableDrivers = async (token) => {
  const data = fetchTable("/user?role=free-driver", token);
  return data;
};

export const deleteRoute = async (routeId, token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/route`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ routeId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting route:", error);
  }
};

export const deleteBus = async (busId, token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bus`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ busId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting bus:", error);
  }
};

export const deleteStop = async (stopId, token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/stop`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stopId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting stop:", error);
  }
};

export const deleteStudent = async (stdId, token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/student`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stdId }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting student:", error);
  }
};

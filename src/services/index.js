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

export const getStudents = async (
  token,
  { search = "", routeId = "", busId = "", stopId = "" }={}
) => {
  const data = fetchTable(
    `/student?search=${search}&routeId=${routeId}&bu
sId=${busId}&stopId=${stopId}`,
    token
  );
  return data;
};

export const getRouteFee = async (token, routeId = "") => {
  const data = fetchTable(`/fee?routeId=${routeId}`, token);
  return data;
};

export const getFeeIntervals = async (token, { year = "", month = "" }={}) => {
  const data = fetchTable(`/fee/interval?year=${year}&month=${month}`, token);

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

export const deleteFee = async (feeId, token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/fee`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ feeId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting fee structure:", error);
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

export const deleteFeeInterval = async (feeIntervalId, token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/fee/interval`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feeIntervalId }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting fee interval:", error);
  }
};

export const deleteGeneratedVouchers = async (feeIntervalId, token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/fee/generate-voucher
`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feeIntervalId }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting generated vouchers:", error);
  }
};

export const deleteVoucher = async (voucherId, token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/fee/student-voucher
`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voucherId }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting student voucher:", error);
  }
};

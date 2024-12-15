"use server";

export const getTopUsers = async () => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/stats/top`,
    {
      method: "GET",
      headers: {
        Authorization: `${process.env.BACKEND_AUTH_TOKEN}`,
      },
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    return { error: "Error fetching top users" };
  }
};

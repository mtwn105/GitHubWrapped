"use server";

export const getAllUsers = async () => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/stats/all`,
    {
      method: "GET",
      headers: {
        Authorization: `${process.env.BACKEND_AUTH_TOKEN}`,
      },
      next: {
        revalidate: 10 * 60,
      },
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    return { error: "Error fetching top users" };
  }
};

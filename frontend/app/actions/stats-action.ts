"use server";

export const generateWrapped = async (username: string) => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/stats/${username}`,
    {
      method: "POST",
      headers: {
        Authorization: `${process.env.BACKEND_AUTH_TOKEN}`,
      },
    }
  );
  if (response.ok) {
    return response.json();
  } else if (response.status === 404) {
    return { error: "Invalid GitHub username" };
  } else {
    return { error: "Error generating wrapped" };
  }
};

export const getStats = async (username: string) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/stats/${username}`,
      {
        next: {
          revalidate: 60 * 60,
        },
        headers: {
          Authorization: `${process.env.BACKEND_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
  return null;
};
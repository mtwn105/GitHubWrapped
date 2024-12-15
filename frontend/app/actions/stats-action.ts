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

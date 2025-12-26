import { getAllUsers } from "./actions/all-user-action";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const allUsersResponse = await getAllUsers();
    const allUsers = allUsersResponse.data || [];
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://githubwrapped.xyz";

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/support`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    const userRoutes: MetadataRoute.Sitemap = allUsers.map(
      (user: { username: string }) => ({
        url: `${baseUrl}/${user.username}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })
    );

    return [...staticRoutes, ...userRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || "https://githubwrapped.xyz",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}

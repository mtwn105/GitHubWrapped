import { getAllUsers } from "./actions/all-user-action";
import { MetadataRoute } from "next";
import { TopUser } from "@/types/topUser";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const topUsersResponse = await getAllUsers();
    const topUsers = topUsersResponse.data || [];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://githubwrapped.xyz';


    const staticRoutes = [{
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }, {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }];

    const userRoutes = topUsers.map((user: TopUser) => ({
      url: `${baseUrl}/${user.username}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [...staticRoutes, ...userRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [{
      url: process.env.NEXT_PUBLIC_APP_URL || 'https://githubwrapped.xyz',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }];
  }
}

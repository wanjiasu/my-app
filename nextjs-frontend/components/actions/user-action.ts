"use server";

import { cookies } from "next/headers";
import { usersCurrentUser } from "@/app/clientService";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { error: "No access token found" };
  }

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data, error } = await usersCurrentUser(options);
    
    if (error) {
      return { error: error };
    }
    
    return { data };
  } catch (err) {
    console.error("Get current user error:", err);
    return { error: "Failed to fetch user information" };
  }
} 
"use server";

import { cookies } from "next/headers";

export async function getUserDashboard(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { error: "No access token found" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/dashboard/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return { error: "Access denied: You can only access your own dashboard" };
      }
      return { error: `Failed to fetch dashboard: ${response.statusText}` };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    console.error("Get user dashboard error:", err);
    return { error: "Failed to fetch dashboard data" };
  }
}

export async function getUserItems(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { error: "No access token found" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/dashboard/${userId}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return { error: "Access denied: You can only access your own items" };
      }
      return { error: `Failed to fetch items: ${response.statusText}` };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    console.error("Get user items error:", err);
    return { error: "Failed to fetch items" };
  }
}

export async function getUserProfile(userId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { error: "No access token found" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/dashboard/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return { error: "Access denied: You can only access your own profile" };
      }
      return { error: `Failed to fetch profile: ${response.statusText}` };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    console.error("Get user profile error:", err);
    return { error: "Failed to fetch profile data" };
  }
}

export async function createUserItem(userId: string, itemData: { name: string; description?: string; quantity?: number }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { error: "No access token found" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/dashboard/${userId}/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      if (response.status === 403) {
        return { error: "Access denied: You can only create items for yourself" };
      }
      return { error: `Failed to create item: ${response.statusText}` };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    console.error("Create user item error:", err);
    return { error: "Failed to create item" };
  }
}

export async function deleteUserItem(userId: string, itemId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { error: "No access token found" };
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/dashboard/${userId}/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return { error: "Access denied: You can only delete your own items" };
      }
      if (response.status === 404) {
        return { error: "Item not found" };
      }
      return { error: `Failed to delete item: ${response.statusText}` };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    console.error("Delete user item error:", err);
    return { error: "Failed to delete item" };
  }
} 
"use server";

import { cookies } from "next/headers";

import { authJwtLogin, usersCurrentUser } from "@/app/clientService";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/definitions";
import { getErrorMessage } from "@/lib/utils";

export async function login(prevState: unknown, formData: FormData) {
  console.log("Login action started");
  
  const validatedFields = loginSchema.safeParse({
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;
  console.log("Attempting login for user:", username);

  const input = {
    body: {
      username,
      password,
    },
  };

  try {
    console.log("Calling authJwtLogin...");
    const { data, error } = await authJwtLogin(input);
    
    if (error) {
      console.error("Auth login error:", error);
      return { server_validation_error: getErrorMessage(error) };
    }
    
    if (!data || !data.access_token) {
      console.error("No access token received:", data);
      return { server_error: "No access token received from server" };
    }
    
    console.log("Login successful, setting cookie...");
    // Set the access token
    (await cookies()).set("accessToken", data.access_token);
    
    // Get current user information to redirect to user-specific dashboard
    const userOptions = {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    };
    
    console.log("Getting user data...");
    const { data: userData, error: userError } = await usersCurrentUser(userOptions);
    
    if (userError) {
      console.error("User data fetch error:", userError);
      // Fallback to general dashboard if user data fetch fails
      redirect("/dashboard");
    }
    
    if (!userData) {
      console.error("No user data received");
      redirect("/dashboard");
    }
    
    console.log("Redirecting to user dashboard:", userData.id);
    // Redirect to user-specific dashboard with /dashboard path
    redirect(`/${userData.id}/dashboard`);
    
  } catch (err) {
    console.error("Login error (catch block):", err);
    
    // Check if this is a Next.js redirect error - if so, re-throw it
    if (err && typeof err === 'object' && 'digest' in err && typeof err.digest === 'string' && err.digest.includes('NEXT_REDIRECT')) {
      throw err;
    }
    
    // More specific error handling for other errors
    if (err instanceof Error) {
      return {
        server_error: `Login failed: ${err.message}`,
      };
    }
    
    return {
      server_error: "An unexpected error occurred. Please try again later.",
    };
  }
}

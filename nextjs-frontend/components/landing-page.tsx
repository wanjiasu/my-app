import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/components/actions/user-action";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { logout } from "@/components/actions/logout-action";

const LandingPage = async () => {
  // Get current user information
  const userResult = await getCurrentUser();
  const user = userResult.data;
  const isLoggedIn = !userResult.error && user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with conditional content */}
      <header className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Next.js & FastAPI
        </div>
        
        {/* Conditional header content */}
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Welcome back, {user.email}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors">
                  <Avatar>
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" className="w-56">
                <DropdownMenuLabel className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    ID: {user.id.slice(0, 8)}...
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href={`/${user.id}/dashboard`}
                    className="flex items-center gap-2 w-full"
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`/${user.id}/profile`}
                    className="flex items-center gap-2 w-full"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`/${user.id}/settings`}
                    className="flex items-center gap-2 w-full"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center px-8 py-16">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
            Welcome to the Next.js & FastAPI Boilerplate
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            A simple and powerful template to get started with full-stack
            development using Next.js and FastAPI.
          </p>

          {/* Features section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Type Safety
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                End-to-end type safety with TypeScript and Zod validation
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built-in authentication system with JWT and password recovery
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Hot Reload
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automatic client generation and hot reload for seamless development
              </p>
            </div>
          </div>

          {/* CTA Buttons - conditional based on login status */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {isLoggedIn ? (
              <>
                <Link href={`/${user.id}/dashboard`}>
                  <Button className="px-8 py-4 text-xl font-semibold rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 focus:ring-4 focus:ring-blue-300">
                    Go to My Dashboard
                  </Button>
                </Link>
                <Link href={`/${user.id}/profile`}>
                  <Button 
                    variant="outline" 
                    className="px-8 py-4 text-xl font-semibold rounded-full shadow-lg border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                  >
                    View Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button className="px-8 py-4 text-xl font-semibold rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 focus:ring-4 focus:ring-blue-300">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    variant="outline" 
                    className="px-8 py-4 text-xl font-semibold rounded-full shadow-lg border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* GitHub Badge */}
          <div className="mt-6">
            <Badge
              variant="outline"
              className="text-sm flex items-center gap-2 px-3 py-2 rounded-lg border-gray-300 dark:border-gray-700"
            >
              <FaGithub className="w-5 h-5 text-black dark:text-white" />
              <Link
                href="https://github.com/vintasoftware/nextjs-fastapi-template"
                target="_blank"
                className="hover:underline"
              >
                View on GitHub
              </Link>
            </Badge>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 
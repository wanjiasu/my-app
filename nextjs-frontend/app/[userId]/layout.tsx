import Link from "next/link";
import { Home, Users2, List, User, Settings } from "lucide-react";
import Image from "next/image";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/components/actions/logout-action";
import { getCurrentUser } from "@/components/actions/user-action";

interface UserLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserLayout({ children, params }: UserLayoutProps) {
  const { userId } = await params;
  
  // Get current user information
  const userResult = await getCurrentUser();
  const user = userResult.data;

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-10 w-16 flex flex-col border-r bg-background p-4">
        <div className="flex flex-col items-center gap-8">
          <Link
            href="/"
            className="flex items-center justify-center rounded-full"
          >
            <Image
              src="/images/vinta.png"
              alt="Vinta"
              width={64}
              height={64}
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
          </Link>
          <Link
            href={`/${userId}/dashboard`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <List className="h-5 w-5" />
          </Link>
          <Link
            href={`/${userId}/profile`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href={`/${userId}/settings`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </aside>
      <main className="ml-16 w-full p-8 bg-muted/40">
        <header className="flex justify-between items-center mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${userId}/dashboard`} className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors">
                  <Avatar>
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" className="w-64">
                <DropdownMenuLabel className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.email || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    ID: {user?.id ? user.id.slice(0, 8) + "..." : "N/A"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-muted-foreground">
                      {user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {user?.is_verified && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs text-muted-foreground">Verified</span>
                      </>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    href={`/${userId}/profile`}
                    className="flex items-center gap-2 w-full"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={`/${userId}/settings`}
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
                    <span>Logout</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <section className="grid gap-6">{children}</section>
      </main>
    </div>
  );
} 
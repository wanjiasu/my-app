import { redirect } from "next/navigation";
import { getCurrentUser } from "@/components/actions/user-action";
import { fetchItems } from "@/components/actions/items-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DeleteButton } from "../../dashboard/deleteButton";
import { ReadItemResponse } from "@/app/openapi-client";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  UserPlus, 
  TrendingUp,
  BarChart3,
  Globe,
  Clock,
  Shield
} from "lucide-react";

interface UserDashboardPageProps {
  params: {
    userId: string;
  };
}

export default async function UserDashboardPage({ params }: UserDashboardPageProps) {
  const { userId } = params;
  
  // Get current user information
  const userResult = await getCurrentUser();
  
  if (userResult.error) {
    redirect("/login");
  }
  
  const currentUser = userResult.data;
  
  // Check if the current user is trying to access their own dashboard
  if (!currentUser || currentUser.id !== userId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Access Denied
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                You can only access your own dashboard.
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href={`/${currentUser?.id}/dashboard`}>
                  <Button size="sm">
                    Go to My Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get items data
  const items = (await fetchItems()) as ReadItemResponse;

  // Mock data for analytics (in real app, this would come from your API)
  const analyticsData = {
    totalUsers: 10234,
    eventCount: 536,
    conversations: 21,
    newUsers: 3321,
    usersLast30Min: 63,
    topCountries: [
      { name: "Bangladesh", users: 5 },
      { name: "India", users: 6 },
      { name: "Pakistan", users: 6 },
      { name: "Australia", users: 10 },
      { name: "America", users: 8 },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your application.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Pick a date
          </Button>
          <Link href={`/${userId}/add-item`}>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add New Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Users className="h-4 w-4 opacity-80" />
              <span className="text-xs opacity-80">Total registered users</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-400 to-orange-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Event Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.eventCount}</div>
            <div className="flex items-center gap-2 mt-2">
              <BarChart3 className="h-4 w-4 opacity-80" />
              <span className="text-xs opacity-80">Events this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-400 to-green-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversations}</div>
            <div className="flex items-center gap-2 mt-2">
              <MessageSquare className="h-4 w-4 opacity-80" />
              <span className="text-xs opacity-80">Active conversations</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.newUsers.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <UserPlus className="h-4 w-4 opacity-80" />
              <span className="text-xs opacity-80">This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Reports Snapshot
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Demographic properties of your customers
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Chart visualization would go here</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Integrate with your preferred charting library
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {analyticsData.usersLast30Min}
                </span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              In Last 30 Minutes
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Per Minutes
                </p>
                <div className="h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded flex items-end justify-center gap-1 p-2">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 rounded-sm"
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        width: '6px'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Top Countries
                </p>
                <div className="space-y-2">
                  {analyticsData.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{country.name}</span>
                      </div>
                      <Badge variant="secondary">{country.users.toString().padStart(2, '0')}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Items
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your items and inventory
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!items.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No items found</p>
                      <p className="text-sm">Add your first item to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.quantity}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                          <span className="text-lg font-semibold">⋯</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem disabled>
                            Edit
                          </DropdownMenuItem>
                          <DeleteButton itemId={item.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 
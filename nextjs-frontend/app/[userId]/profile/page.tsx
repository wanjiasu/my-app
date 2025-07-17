import { redirect } from "next/navigation";
import { getCurrentUser } from "@/components/actions/user-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Key,
  ArrowLeft
} from "lucide-react";

interface UserProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;
  
  // Get current user information
  const userResult = await getCurrentUser();
  
  if (userResult.error) {
    redirect("/login");
  }
  
  const currentUser = userResult.data;
  
  // Check if the current user is trying to access their own profile
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
                You can only access your own profile.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/${userId}/dashboard`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account information and settings
          </p>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-blue-500 text-white text-2xl">
                {currentUser.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    User ID
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Key className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white font-mono">
                      {currentUser.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentUser.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">Account Status</span>
              </div>
              <Badge variant={currentUser.is_active ? "default" : "destructive"}>
                {currentUser.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentUser.is_verified ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                <span className="text-sm font-medium">Verification</span>
              </div>
              <Badge variant={currentUser.is_verified ? "default" : "secondary"}>
                {currentUser.is_verified ? "Verified" : "Pending"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentUser.is_superuser ? 'bg-purple-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">Role</span>
              </div>
              <Badge variant={currentUser.is_superuser ? "default" : "outline"}>
                {currentUser.is_superuser ? "Admin" : "User"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Type
                </label>
                <p className="text-sm text-gray-900 dark:text-white mt-1">
                  {currentUser.is_superuser ? "Administrator" : "Standard User"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permissions
                </label>
                <div className="flex items-center gap-2 mt-1">
                  {currentUser.is_active ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-900 dark:text-white">
                    {currentUser.is_active ? "Full Access" : "Limited Access"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Security Information
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your account is secured with JWT authentication. 
                  {currentUser.is_verified ? " Email verification is complete." : " Please verify your email address."}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Privacy Notice
              </h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  This profile page is private and can only be accessed by you (User ID: {userId.slice(0, 8)}...). 
                  Other users cannot view your personal information.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
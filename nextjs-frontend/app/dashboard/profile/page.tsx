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

export default async function ProfilePage() {
  const userResult = await getCurrentUser();
  const user = userResult.data;

  if (userResult.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Error Loading Profile
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {String(userResult.error)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account information and settings
        </p>
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
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
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
                      {user?.email || "Not provided"}
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
                      {user?.id || "Not available"}
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
                <div className={`w-3 h-3 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">Account Status</span>
              </div>
              <Badge variant={user?.is_active ? "default" : "destructive"}>
                {user?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${user?.is_verified ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                <span className="text-sm font-medium">Verification</span>
              </div>
              <Badge variant={user?.is_verified ? "default" : "secondary"}>
                {user?.is_verified ? "Verified" : "Pending"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${user?.is_superuser ? 'bg-purple-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">Role</span>
              </div>
              <Badge variant={user?.is_superuser ? "default" : "outline"}>
                {user?.is_superuser ? "Admin" : "User"}
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
                  {user?.is_superuser ? "Administrator" : "Standard User"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permissions
                </label>
                <div className="flex items-center gap-2 mt-1">
                  {user?.is_active ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-900 dark:text-white">
                    {user?.is_active ? "Full Access" : "Limited Access"}
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
                  {user?.is_verified ? " Email verification is complete." : " Please verify your email address."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
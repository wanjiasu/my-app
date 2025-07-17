import { redirect } from "next/navigation";
import { getCurrentUser } from "@/components/actions/user-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addItemForUser } from "@/components/actions/items-action";
import Link from "next/link";
import { ArrowLeft, Plus, Shield } from "lucide-react";

interface AddItemPageProps {
  params: {
    userId: string;
  };
}

export default async function AddItemPage({ params }: AddItemPageProps) {
  const { userId } = params;
  
  // Get current user information
  const userResult = await getCurrentUser();
  
  if (userResult.error) {
    redirect("/login");
  }
  
  const currentUser = userResult.data;
  
  // Check if the current user is trying to access their own add-item page
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
                You can only access your own pages.
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Item</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a new item to add to your inventory
          </p>
        </div>
      </div>

      {/* Add Item Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Item Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addItemForUser} className="space-y-4">
            <input type="hidden" name="userId" value={userId} />
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter item name"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Enter item description"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                required
                min="1"
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
              <Link href={`/${userId}/dashboard`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
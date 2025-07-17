import { redirect } from "next/navigation";

interface UserPageProps {
  params: {
    userId: string;
  };
}

export default function UserPage({ params }: UserPageProps) {
  const { userId } = params;
  
  // Redirect to dashboard
  redirect(`/${userId}/dashboard`);
} 
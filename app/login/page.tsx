import LoginForm from "@/components/LoginForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type SearchParamsProps = {
  searchParams: {
    message: string;
  };
};

export default async function LoginPage({ searchParams }: SearchParamsProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className='bg-blue-50 dark:bg-gray-950'>
      <div className='px-4 py-12 w-full min-h-screen max-w-lg mx-auto '>
        {searchParams.message && (
          <p className='text-red-500 bg-red-500/10 rounded-lg p-3 my-2 text-sm text-center'>
            {searchParams.message}
          </p>
        )}

        <LoginForm />
      </div>
    </div>
  );
}

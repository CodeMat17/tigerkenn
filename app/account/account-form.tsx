"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/clients";
import { type User } from "@supabase/supabase-js";
import { toast } from "sonner";


export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
 

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
      }
    } catch (error) {
      alert(`Error loading user data! ${error}`);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
   
  }: {
  
    fullname: string | null;

  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
  
        updated_at: new Date().toISOString(),
      });
        if (error) throw error;
        toast('DONE!', {
            description: 'Profile updated successfully',
        })
   
    } catch (error) {
      alert(`Error updating the data! ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='form-widget'>
      {/* ... */}

      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='text' value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor='fullName'>Full Name</label>
        <input
          id='fullName'
          type='text'
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
   

      <div>
        <button
          className='button primary block'
          onClick={() =>
            updateProfile({ fullname})
          }
          disabled={loading}>
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <form action='/auth/signout' method='post'>
          <button className='button block' type='submit'>
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

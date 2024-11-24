import {createClient} from '@/utils/supabase/server'

import AddNewTopic from "@/components/AddNewTopic";
import { redirect } from 'next/navigation';



const NewTopicPage = async () => {

const supabase = createClient()

  const {data: {user}} = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
  <AddNewTopic user={user} />
  );
};

export default NewTopicPage;

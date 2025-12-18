import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }
  return (
    <div>
      <Sidebar>
        <SidebarContent />
      </Sidebar>
    </div>
  );
};

export default Dashboard;

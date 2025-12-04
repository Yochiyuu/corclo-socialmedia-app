import { exportUserData, fetchFeedLog } from "@/app/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppHeader from "@/components/Layout/AppHeader";
import AppSidebar from "@/components/Layout/AppSidebar";

import SettingsView from "@/components/Settings/SettingsView"; 

async function AutonomyHub() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  
  if (!userIdCookie) redirect("/login");

  const currentUserId = parseInt(userIdCookie);
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { username: true, avatar: true, name: true },
  });

  if (!currentUser) redirect("/login");

  const feedLogs = await fetchFeedLog(); 
  const totalViews = feedLogs.length;
  
  const interactionLogs = await (prisma as any).userEngagementLog.count({
    where: { 
        actorId: currentUserId, 
        type: { in: ['LIKE', 'COMMENT'] } 
    }
  });

  const uniquePostsViewed = new Set(feedLogs.map(log => log.targetPost?.id).filter(id => id !== undefined)).size;
  const attentionRatio = uniquePostsViewed > 0 ? (interactionLogs / uniquePostsViewed) * 100 : 0;
  
  return (
    <>
      <AppHeader currentUser={currentUser} />
      {/* Panggil Client Component dan kirim data yang telah di-fetch */}
      <SettingsView 
          currentUser={currentUser}
          feedLogs={feedLogs}
          totalViews={totalViews}
          attentionRatio={attentionRatio}
          interactionLogs={interactionLogs}
      />
    </>
  );
}

export default AutonomyHub;
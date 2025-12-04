import AppHeader from "@/components/Layout/AppHeader";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AffinityEchoView from "@/components/Connect/AffinityEchoView";

async function fetchAffinitySuggestions(currentUserId: number) {
    const suggestions = await prisma.user.findMany({
        where: {
            id: { not: currentUserId },
            followedBy: { none: { followerId: currentUserId } },
        },
        take: 6,
        select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            _count: {
                select: {
                    followedBy: true,
                    following: true
                }
            }
        }
    });

    // Dummy logic untuk skor afinitas (Nantinya diganti dengan logika calculateAffinityScore)
    const suggestionsWithScore = suggestions.map((user, index) => ({
        ...user,
        affinityScore: 0.75 + (index % 2 === 0 ? 0.05 : -0.05), // Contoh skor 0.70 atau 0.80
        mutualGroups: 2 + (index % 3),
        mutualFollowers: 1 + (index % 2)
    }));
    
    return suggestionsWithScore;
}


export default async function AffinityEchoPage() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  
  if (!userIdCookie) redirect("/login");

  const currentUserId = parseInt(userIdCookie);
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { username: true, avatar: true, name: true },
  });

  if (!currentUser) redirect("/login");

  const affinitySuggestions = await fetchAffinitySuggestions(currentUserId);

  return (
    <>
      <AppHeader currentUser={currentUser} />
      {/* Render Client Component dan kirim data */}
      <AffinityEchoView 
        currentUser={currentUser} 
        affinitySuggestions={affinitySuggestions}
      />
    </>
  );
}
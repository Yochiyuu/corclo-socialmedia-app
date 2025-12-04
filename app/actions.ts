"use server";

import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export type EngagementType = 'VIEW' | 'LIKE' | 'COMMENT' | 'FOLLOW' | 'DM_SEND' | 'PING_SEND';

export type ActionState = {
  message: string;
  success: boolean;
} | null;

type AffinityFormState = { success: boolean; message: string; } | undefined | null;
// --- AUTH & USER ---

export async function registerUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !username || !email || !password) {
    return { success: false, message: "Semua kolom wajib diisi!" };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Username atau Email sudah terdaftar!",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // KODE REMOTE (Generate Avatar API)
    const avatarUrl = `/api/avatar?name=${encodeURIComponent(name)}`;

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        // MEMPERTAHANKAN PERUBAHAN AVATAR DARI REMOTE
        avatar: avatarUrl,
      },
    });

    (await cookies()).set("userId", newUser.id.toString(), { httpOnly: true });
  } catch (error) {
    console.error("Register Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server. Coba lagi nanti.",
    };
  }

  redirect(`/profile/${username}`);
}

export async function loginUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email dan Password wajib diisi!" };
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: "Email atau password salah!" };
    }

    (await cookies()).set("userId", user.id.toString(), { httpOnly: true });
  } catch (error) {
    console.error("Login Error:", error);
    return {
      success: false,
      message: "Gagal login. Cek koneksi atau coba lagi.",
    };
  }

  redirect(`/profile/${user.username}`);
}

export async function logout() {
  (await cookies()).delete("userId");
  redirect("/login");
}

// --- POSTS ---

export async function createPost(formData: FormData) {
  const content = formData.get("content") as string;
  const mediaFile = formData.get("media") as File;

  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) {
    redirect("/login");
  }

  const hasContent = content && content.trim().length > 0;
  const hasMedia = mediaFile && mediaFile.size > 0;

  if (!hasContent && !hasMedia) {
    throw new Error("Postingan tidak boleh kosong.");
  }

  const authorId = parseInt(userIdCookie);

  let mediaUrl = null;
  let mediaType: "IMAGE" | "VIDEO" | null = null;

  if (mediaFile && mediaFile.size > 0) {
    try {
      const blob = await put(mediaFile.name, mediaFile, {
        access: "public",
      });

      mediaUrl = blob.url;

      if (mediaFile.type.startsWith("image")) {
        mediaType = "IMAGE";
      } else if (mediaFile.type.startsWith("video")) {
        mediaType = "VIDEO";
      }
    } catch (error) {
      console.error("Gagal upload file:", error);
    }
  }

  await prisma.post.create({
    data: {
      content: content || "",
      authorId,
      mediaUrl,
      mediaType,
      visibility: "PUBLIC", // DITAMBAHKAN LOKAL
    },
  });

  revalidatePath("/home");
  const user = await prisma.user.findUnique({ where: { id: authorId } });
  if (user) {
    revalidatePath(`/profile/${user.username}`);
  }

  redirect("/home");
}

export async function deletePost(postId: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== parseInt(userId)) {
    throw new Error("Forbidden");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/");
  revalidatePath("/home");
}

export async function toggleLike(postId: number) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) return;
  const userId = parseInt(userIdCookie);

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      await logEngagement("LIKE", postId);
      await createNotification(post.authorId, userId, "LIKE", postId);
    }

    revalidatePath("/home");
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}

// --- BOOKMARKS (TAMBAHAN LOKAL) ---

export async function toggleBookmark(postId: number) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) return;
  const userId = parseInt(userIdCookie);

  try {
    const existingBookmark = await (prisma as any).bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
      await (prisma as any).bookmark.delete({
        where: { id: existingBookmark.id },
      });
    } else {
      await (prisma as any).bookmark.create({
        data: {
          userId,
          postId,
        },
      });
    }

    revalidatePath("/home");
  } catch (error) {
    console.error("Error toggling bookmark:", error);
  }
}

// --- ADD COMMENT (MODIFIKASI LOKAL untuk Threaded Comments) ---

export async function addComment(postId: number, content: string, parentId?: number) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie || !content.trim()) return;

  const userId = parseInt(userIdCookie);

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return;

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
        parentId,
      },
    });

    await logEngagement("COMMENT", postId);
    await createNotification(post.authorId, userId, "COMMENT", postId, newComment.id);

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (parentComment && parentComment.userId !== post.authorId) {
        await createNotification(parentComment.userId, userId, "REPLY", postId, newComment.id);
      }
    }

    revalidatePath("/home");
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

// --- SOCIAL ---

export async function toggleFollow(targetUserId: number) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) return;
  const currentUserId = parseInt(userIdCookie);

  if (currentUserId === targetUserId) return;

  try {
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      await prisma.follows.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });

      await logEngagement("FOLLOW" as EngagementType, undefined, targetUserId); // TAMBAHAN LOKAL
      await createNotification(targetUserId, currentUserId, "FOLLOW");
    }

    revalidatePath("/home");
    revalidatePath(`/profile/[username]`);
  } catch (error) {
    console.error("Error toggling follow:", error);
  }
}

export async function searchUsers(query: string) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}

// --- UPDATE PROFILE (TAMBAHAN LOKAL) ---

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) {
    redirect("/login");
  }

  const userId = parseInt(userIdCookie);
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const bio = formData.get("bio") as string;
  const avatarFile = formData.get("avatar") as File;

  if (!name || !username) {
    throw new Error("Nama dan Username tidak boleh kosong");
  }

  const oldUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });

  if (!oldUser) throw new Error("User tidak ditemukan");

  let avatarUrl = undefined;

  if (avatarFile && avatarFile.size > 0) {
    try {
      const filename = `avatar-${userId}-${Date.now()}-${avatarFile.name}`;
      const blob = await put(filename, avatarFile, {
        access: "public",
      });
      avatarUrl = blob.url;
    } catch (error) {
      console.error("Gagal upload avatar:", error);
      throw new Error("Gagal mengupload gambar");
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        bio,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Username sudah digunakan orang lain!");
    }
    console.error("Update Profile Error:", error);
    throw new Error("Gagal mengupdate profil");
  }

  if (oldUser.username !== username) {
    redirect(`/profile/${username}`);
  } else {
    revalidatePath(`/profile/${username}`);
  }
}

// --- STORIES (TAMBAHAN LOKAL) ---

export async function createStory(formData: FormData) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie) {
    redirect("/login");
  }

  const userId = parseInt(userIdCookie);
  const mediaFile = formData.get("media") as File;

  if (!mediaFile || mediaFile.size === 0) {
    throw new Error("File story tidak boleh kosong");
  }

  let mediaUrl = "";
  let mediaType: "IMAGE" | "VIDEO" = "IMAGE";

  try {
    const filename = `story-${userId}-${Date.now()}-${mediaFile.name}`;
    const blob = await put(filename, mediaFile, {
      access: "public",
    });
    mediaUrl = blob.url;

    if (mediaFile.type.startsWith("video")) {
      mediaType = "VIDEO";
    }
  } catch (error) {
    console.error("Gagal upload story:", error);
    throw new Error("Gagal mengupload story");
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.story.create({
    data: {
      mediaUrl,
      mediaType,
      expiresAt,
      userId,
    },
  });

  revalidatePath("/home");
  redirect("/home");
}

// --- CHAT FUNCTIONS (DI BAWAH INI SEJAK getConversations HINGGA toggleMessageLike)
// --- SEMUA FUNGSI INI HARUS DIPERTAHANKAN SEPERTI DI LOKAL.

// 1. Ambil Daftar Chat
export async function getConversations() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  if (!userIdCookie) return [];

  const userId = parseInt(userIdCookie);

  return await prisma.conversation.findMany({
    where: {
      participants: {
        some: { id: userId },
      },
    },
    include: {
      participants: {
        where: { id: { not: userId } },
        select: { id: true, username: true, name: true, avatar: true },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

// 2. Ambil Pesan berdasarkan USERNAME lawan bicara
export async function getMessagesByUsername(targetUsername: string) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  if (!userIdCookie) return null;

  const currentUserId = parseInt(userIdCookie);

  // Cari user target
  const targetUser = await prisma.user.findUnique({
    where: { username: targetUsername },
  });

  if (!targetUser) return null;

  const conversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: currentUserId } } },
        { participants: { some: { id: targetUser.id } } },
      ],
    },
    include: {
      messages: {
        include: {
          sender: { select: { id: true, username: true, avatar: true } },
          likes: true,
        },
        orderBy: { createdAt: "asc" },
      },
      participants: {
        select: { id: true, username: true, name: true, avatar: true },
      },
    },
  });

  return { conversation, targetUser };
}

// 3. Start Conversation (Redirect ke Username)
export async function startConversation(targetUserId: number) {
  const cookieStore = await cookies();
  const currentUserId = parseInt(cookieStore.get("userId")?.value || "0");
  if (!currentUserId) return;

  const existingConv = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: currentUserId } } },
        { participants: { some: { id: targetUserId } } },
      ],
    },
    include: { participants: true },
  });

  let targetUsername = "";

  if (existingConv) {
    const otherUser = existingConv.participants.find(
      (p) => p.id === targetUserId
    );
    targetUsername = otherUser?.username || "";
  } else {
    const newConv = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: currentUserId }, { id: targetUserId }],
        },
      },
      include: { participants: true },
    });
    const otherUser = newConv.participants.find((p) => p.id === targetUserId);
    targetUsername = otherUser?.username || "";
  }

  if (targetUsername) {
    redirect(`/messages/${targetUsername}`);
  }
}

// 4. Kirim Pesan (Text + Media)
export async function sendMessage(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return;

  const conversationIdIdStr = formData.get("conversationId") as string;
  const content = formData.get("content") as string;
  const mediaFile = formData.get("media") as File;

  if (!conversationIdIdStr) return;
  const conversationId = parseInt(conversationIdIdStr);

  const hasContent = content && content.trim().length > 0;
  const hasMedia = mediaFile && mediaFile.size > 0;

  if (!hasContent && !hasMedia) return;

  let mediaUrl = null;
  let mediaType: "IMAGE" | "VIDEO" | null = null;

  if (hasMedia) {
    try {
      const filename = `chat-${userId}-${Date.now()}-${mediaFile.name}`;
      const blob = await put(filename, mediaFile, { access: "public" });
      mediaUrl = blob.url;
      mediaType = mediaFile.type.startsWith("video") ? "VIDEO" : "IMAGE";
    } catch (error) {
      console.error("Gagal upload media chat:", error);
    }
  }

  await prisma.message.create({
    data: {
      content: hasContent ? content : null,
      conversationId,
      senderId: parseInt(userId),
      mediaUrl,
      mediaType,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  const targetUser = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  }).then(conv => conv?.participants.find(p => p.id !== parseInt(userId!)));

  if (targetUser) {
    await logEngagement("DM_SEND" as EngagementType, undefined, targetUser.id); // TAMBAHAN LOKAL
  }

  revalidatePath("/messages");
  revalidatePath("/messages/[username]");
}

// 5. Edit Pesan
export async function editMessage(messageId: number, newContent: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId || !newContent.trim()) return;

  const msg = await prisma.message.findUnique({ where: { id: messageId } });
  if (!msg || msg.senderId !== parseInt(userId)) {
    throw new Error("Unauthorized");
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { content: newContent, isEdited: true },
  });

  revalidatePath("/messages");
}

// 6. Delete Pesan
export async function deleteMessage(messageId: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return;

  const msg = await prisma.message.findUnique({ where: { id: messageId } });
  if (!msg || msg.senderId !== parseInt(userId)) {
    throw new Error("Unauthorized");
  }

  await prisma.message.delete({ where: { id: messageId } });
  revalidatePath("/messages");
}

// 7. Like Pesan
export async function toggleMessageLike(messageId: number) {
  const cookieStore = await cookies();
  const userId = parseInt(cookieStore.get("userId")?.value || "0");
  if (!userId) return;

  const existing = await prisma.messageLike.findUnique({
    where: { userId_messageId: { userId, messageId } },
  });

  if (existing) {
    await prisma.messageLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.messageLike.create({ data: { userId, messageId } });
  }
  revalidatePath("/messages");
}

// --- FUNGSI BARU CRITICAL: ENGAGEMENT & DASHBOARD & AFFINITY ---

export async function logEngagement(
  type: EngagementType,
  postId?: number,
  targetUserId?: number
) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  if (!userIdCookie) return;

  try {
    await (prisma as any).userEngagementLog.create({
      data: {
        actorId: parseInt(userIdCookie),
        type: type,
        targetPostId: postId,
        targetUserId: targetUserId,
      },
    });
  } catch (error) {
    console.error(`Error logging ${type}:`, error);
  }
}

export async function fetchFeedLog() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  if (!userIdCookie) return [];
  const currentUserId = parseInt(userIdCookie);

  // Ambil 100 log VIEW terakhir
  return await prisma.userEngagementLog.findMany({
    where: { actorId: currentUserId, type: "VIEW" },
    orderBy: { timestamp: "desc" },
    take: 100,
    include: {
      targetPost: {
        select: {
          id: true,
          content: true,
          author: { select: { username: true, name: true } }
        }
      }
    },
  });
}

export async function exportUserData(formData: FormData) {
  const cookieStore = await cookies();
  const userIdCookie = (await cookieStore).get("userId")?.value;

  if (!userIdCookie) return;
  const currentUserId = parseInt(userIdCookie);

  const userData = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      username: true,
      email: true,
      posts: true,
      comments: true,
      likes: true,
      engagementActor: true,
    },
  });

  console.log("DATA EXPORT TRIGGERED:", userData?.username);
}

const PING_LIMIT_PER_DAY = 3;

/**
 * Menghitung skor afinitas berdasarkan Mutuals
 */
async function calculateAffinityScore(currentUserId: number, targetUserId: number): Promise<{ score: number, mutualFollowers: number }> {
  const targetFollowing = await prisma.follows.findMany({
    where: { followerId: targetUserId },
    select: { followingId: true }
  });

  const targetFollowingIds = targetFollowing.map(f => f.followingId);

  const mutualFollowsCount = await prisma.follows.count({
    where: {
      followerId: currentUserId,
      followingId: {
        in: targetFollowingIds // Filter dengan ID yang di-follow oleh Target
      }
    }
  });

  // --- Affinity Logic ---
  let score = 0.5;
  if (mutualFollowsCount > 2) {
    score = 0.8;
  } else if (mutualFollowsCount > 0) {
    score = 0.65;
  }

  return { score, mutualFollowers: mutualFollowsCount };
}


export async function sendAffinityPing(
  // Argumen 1: prevState
  prevState: AffinityFormState,
  // Argumen 2: formData
  formData: FormData
): Promise<AffinityFormState> { // Mengembalikan Promise<State>
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  if (!userIdCookie) return prevState;
  const currentUserId = parseInt(userIdCookie);

  // Ambil targetUserId dari FormData
  const targetUserIdStr = formData.get("targetUserId") as string;
  if (!targetUserIdStr) return { success: false, message: "Target ID hilang." };

  const targetUserId = parseInt(targetUserIdStr);

  if (currentUserId === targetUserId) {
    return { success: false, message: "Tidak bisa mengirim Ping ke diri sendiri." };
  }

  const PING_LIMIT_PER_DAY = 3;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Cek batas Ping harian
  const sentToday = await (prisma as any).affinityPing.count({
    where: {
      senderId: currentUserId,
      createdAt: { gte: today },
    },
  });

  if (sentToday >= PING_LIMIT_PER_DAY) {
    return { success: false, message: `Batas Ping harian (${PING_LIMIT_PER_DAY}x) telah tercapai.` };
  }

  // Cek apakah Ping sudah pernah terkirim
  const existingPing = await (prisma as any).affinityPing.findUnique({
    where: { senderId_receiverId: { senderId: currentUserId, receiverId: targetUserId } }
  });

  if (existingPing) {
    return { success: false, message: "Anda sudah pernah mengirim Ping ke pengguna ini." };
  }

  // Asumsi calculateAffinityScore mengembalikan { score: number }
  const { score } = await (calculateAffinityScore as any)(currentUserId, targetUserId);

  await (prisma as any).affinityPing.create({
    data: {
      senderId: currentUserId,
      receiverId: targetUserId,
      status: "PENDING",
      score: score,
    },
  });

  await logEngagement("PING_SEND" as EngagementType, undefined, targetUserId);

  revalidatePath("/connect/echo");
  return { success: true, message: "Affinity Ping terkirim! Menunggu tanggapan." };
}

// FUNGSI UNTUK EXPLORE VIEW
export async function getPostDetails(postId: number) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        likes: { select: { userId: true } },
        comments: {
          include: {
            user: { select: { id: true, username: true, avatar: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
}

export async function acceptAffinityPing(pingId: number) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  if (!userIdCookie) return;
  const currentUserId = parseInt(userIdCookie);

  const ping = await (prisma as any).affinityPing.findUnique({
    where: { id: pingId },
  });

  if (!ping || ping.receiverId !== currentUserId) {
    throw new Error("Unauthorized");
  }

  await (prisma as any).affinityPing.update({
    where: { id: pingId },
    data: { status: "ACCEPTED" },
  });

  revalidatePath("/connect/echo");
}

async function createNotification(
  recipientId: number,
  senderId: number,
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'REPLY',
  postId?: number,
  commentId?: number
) {
  if (recipientId === senderId) return;

  try {
    if (type === 'LIKE' || type === 'FOLLOW') {
      const existing = await (prisma as any).notification.findFirst({
        where: {
          recipientId,
          senderId,
          type,
          postId,
          read: false,
        },
      });
      if (existing) return;
    }

    await (prisma as any).notification.create({
      data: {
        recipientId,
        senderId,
        type,
        postId,
        commentId,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function getNotifications() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  if (!userIdCookie) return [];

  const notifications = await (prisma as any).notification.findMany({
    where: { recipientId: parseInt(userIdCookie) },
    include: {
      sender: {
        select: { username: true, avatar: true },
      },
      post: {
        select: { id: true, content: true, mediaUrl: true },
      },
      comment: {
        select: { content: true },
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return notifications;
}

export async function markNotificationsAsRead() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;
  if (!userIdCookie) return;

  await (prisma as any).notification.updateMany({
    where: {
      recipientId: parseInt(userIdCookie),
      read: false,
    },
    data: { read: true },
  });

  revalidatePath("/notifications");
}
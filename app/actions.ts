"use server";

import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type ActionState = {
  message: string;
  success: boolean;
} | null;

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

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random`,
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
    }

    revalidatePath("/home");
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}

export async function addComment(postId: number, content: string) {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId")?.value;

  if (!userIdCookie || !content.trim()) return;

  const userId = parseInt(userIdCookie);

  try {
    await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });

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

// --- STORIES ---

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
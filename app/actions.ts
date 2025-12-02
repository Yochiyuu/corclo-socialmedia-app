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

"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDiscussions() {
  try {
    return await prisma.discussion.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        zone: {
          include: { affectedUserLocations: true },
        },
        comments: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getDiscussionById(id: number) {
  try {
    return await prisma.discussion.findUnique({
      where: { id },
      include: {
        zone: {
          include: {
            affectedUserLocations: {
              include: { userLocation: true },
            },
          },
        },
        comments: { include: { author: true } },
      },
    });
  } catch (error) {
    console.log(error);
  }
}

interface CommentData {
  discussionId: number;
  content: string;
  parentId?: number;
}

export async function addComment({
  discussionId,
  content,
  parentId,
}: CommentData) {
  if (!content.trim()) throw new Error("Comment cannot be empty");

  const session = await auth();
  const user = session?.user;
  if (!user) throw new Error("Unauthorized");

  await prisma.discussionComment.create({
    data: {
      content,
      discussion: { connect: { id: discussionId } },
      parent: parentId ? { connect: { id: parentId } } : undefined,
      author: { connect: { id: user.id } },
    },
  });

  revalidatePath(`/discussion/${discussionId}`);
}

export async function getComments(discussionId: number) {
  return prisma.discussionComment.findMany({
    where: {
      discussionId,
      parentId: null,
    },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

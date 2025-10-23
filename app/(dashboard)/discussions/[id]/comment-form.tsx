"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { addComment } from "@/actions/discussion.action";

export function CommentForm({
  discussionId,
  parentId,
}: {
  discussionId: number;
  parentId?: number;
}) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    startTransition(async () => {
      await addComment({ discussionId, content, parentId });
      setContent("");
    });
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={parentId ? "Write a reply..." : "Share updates..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
        <Send className="w-4 h-4" />
        {parentId ? "Reply" : "Post"}
      </Button>
    </div>
  );
}

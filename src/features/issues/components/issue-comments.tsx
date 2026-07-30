"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

interface CommentUser {
  id: string
  name: string | null
  image: string | null
}

interface Comment {
  id: string
  body: string
  isEdited: boolean
  createdAt: string
  user: CommentUser
  replies?: Comment[]
}

interface IssueCommentsProps {
  comments: Comment[]
  issueId: string
  currentUserId: string
}

export function IssueComments({
  comments,
  issueId,
  currentUserId,
}: IssueCommentsProps) {
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const postComment = async (body: string, parentId?: string) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, issueId, parentId }),
      })
      if (res.ok) {
        setNewComment("")
        setReplyText("")
        setReplyTo(null)
        router.refresh()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const editComment = async (commentId: string, body: string) => {
    setSubmitting(true)
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      })
      setEditingId(null)
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  const deleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } catch {
      // silently ignore
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">
        Comments ({comments.length})
      </h3>

      {/* New comment */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-lg border border-input bg-transparent p-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => postComment(newComment)}
              disabled={!newComment.trim() || submitting}
              type="button"
            >
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments */}
      {comments.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No comments yet
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <div className="flex gap-3">
                <Avatar
                  src={comment.user.image}
                  fallback={comment.user.name?.[0] ?? "?"}
                  size="sm"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {comment.user.name ?? "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                    {comment.isEdited && (
                      <span className="text-xs text-muted-foreground">
                        (edited)
                      </span>
                    )}
                  </div>

                  {editingId === comment.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-input bg-transparent p-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          onClick={() => editComment(comment.id, editText)}
                          disabled={submitting}
                          type="button"
                        >
                          Save
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          type="button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setReplyTo(
                          replyTo === comment.id ? null : comment.id,
                        )
                      }}
                      className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Reply className="size-3" />
                      Reply
                    </button>
                    {comment.user.id === currentUserId &&
                      editingId !== comment.id && (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(comment.id)
                              setEditText(comment.body)
                            }}
                            className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="size-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3" />
                            Delete
                          </button>
                        </>
                      )}
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 mt-3 space-y-3 border-l-2 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <Avatar
                            src={reply.user.image}
                            fallback={reply.user.name?.[0] ?? "?"}
                            size="sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {reply.user.name ?? "Unknown"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                              {reply.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply form */}
                  {replyTo === comment.id && (
                    <div className="ml-4 mt-2 space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        rows={2}
                        className="w-full rounded-lg border border-input bg-transparent p-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          onClick={() => postComment(replyText, comment.id)}
                          disabled={!replyText.trim() || submitting}
                          type="button"
                        >
                          Reply
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => setReplyTo(null)}
                          type="button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

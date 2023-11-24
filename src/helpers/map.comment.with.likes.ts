import { CommentsForResponse } from "../types/types";

export const mapCommentWithLikes = (comment): CommentsForResponse => ({
  id: comment.c_id,
  content: comment.c_content,
  commentatorInfo: {
    userId: comment.c_userId,
    userLogin: comment.c_userLogin,
  },
  createdAt: comment.c_createdAt,
  likesInfo: {
    likesCount: +comment.likesCount,
    dislikesCount: +comment.dislikesCount,
    myStatus: comment.myStatus ? comment.myStatus : "None",
  },
});

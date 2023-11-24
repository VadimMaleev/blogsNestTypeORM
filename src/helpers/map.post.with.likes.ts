import { PostsForResponse } from "../types/types";

export const mapPostWithLikes = (post): PostsForResponse => ({
  id: post.p_id,
  title: post.p_title,
  shortDescription: post.p_shortDescription,
  content: post.p_content,
  blogId: post.p_blogId,
  blogName: post.p_blogName,
  createdAt: post.p_createdAt,
  extendedLikesInfo: {
    likesCount: +post.likesCount,
    dislikesCount: +post.dislikesCount,
    myStatus: post.myStatus ? post.myStatus : "None",
    newestLikes: post.newestLikes,
  },
});

import { CommentsForResponse, PostsForResponse } from '../types/types';

export const plugForCreatingPosts = (post): PostsForResponse => ({
  id: post.id,
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
  extendedLikesInfo: {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: 'None',
    newestLikes: [],
  },
});

export const plugForCreatingComment = (comment): CommentsForResponse => ({
  id: comment.id,
  content: comment.content,
  commentatorInfo: {
    userId: comment.userId,
    userLogin: comment.userLogin,
  },
  createdAt: comment.createdAt,
  likesInfo: {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: 'None',
  },
});

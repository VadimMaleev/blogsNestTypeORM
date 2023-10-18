export const mapBlogsForAdmin = (blog) => ({
  id: blog.id,
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
  blogOwnerInfo: {
    userId: blog.userId,
    userLogin: blog.login,
  },
  banInfo: {
    isBanned: blog.isBanned,
    banDate: blog.banDate,
  },
});

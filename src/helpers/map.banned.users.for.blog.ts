export const mapBannedUsersForBlog = (bannedUser) => ({
  id: bannedUser.userId,
  login: bannedUser.login,
  banInfo: {
    isBanned: bannedUser.isBanned,
    banDate: bannedUser.banDate,
    banReason: bannedUser.banReason,
  },
});

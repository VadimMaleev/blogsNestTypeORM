//Blogs
export type BlogsForResponse = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogsPaginationResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogsForResponse[];
};

//Users

export type UsersForResponse = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
  // banInfo: {
  //   isBanned: boolean;
  //   banDate: Date | null;
  //   banReason: string | null;
  // };
};

export type UsersPaginationResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UsersForResponse[];
};

//Posts

export type PostsForResponse = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: NewestLikes[];
  };
};

export type PostsPaginationResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsForResponse[];
};

//Comments

export type CommentsPaginationResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentsForResponse[];
};

export type CommentsForResponse = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

export type NewestLikes = {
  addedAt: Date;
  userId: string;
  login: string;
};

export type BannedUsersForBlogResponse = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BannedUserForBlog[];
};

export type BannedUserForBlog = {
  id: string;
  login: string;
  banInfo: {
    isBanned: boolean;
    banDate: Date;
    banReason: string;
  };
};

//Games
export type CreatedGameResponse = {
  id: string;
  firstPlayerProgress: {
    answers: AnswersType[] | [];
    player: {
      id: string;
      login: string;
    };
    score: number;
  };
  secondPlayerProgress: {
    answers: AnswersType[] | [];
    player: {
      id: string | null;
      login: string | null;
    };
    score: number;
  };
  questions: QuestionsType[] | [];
  status: GameStatusEnum;
  pairCreatedDate: Date;
  startGameDate: Date | null;
  finishGameDate: Date | null;
};

export type AnswersType = {
  questionId: string;
  answerStatus: AnswersEnum;
  addedAt: Date;
};

export type QuestionsType = {
  id: string;
  body: string;
};

//Enums
export enum LikesStatusEnum {
  Like = "Like",
  Dislike = "Dislike",
  None = "None",
}

export enum SortDirectionEnum {
  asc = "ASC",
  desc = "DESC",
}

export enum AnswersEnum {
  Correct = "Correct",
  Incorrect = "Incorrect",
}

export enum GameStatusEnum {
  PendingSecondPlayer = "PendingSecondPlayer",
  Active = "Active",
  Finished = "Finished",
}

//Quiz
export type QuizQuestionResponse = {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Book = {
  id: any;
  title: string;
  author: string;
  description: string;
  photo: string;
  avgUserRating?: number;
  numUserRatings: number;
  avgProfRating?: number;
  numProfRatings: number;
};

type Admin = {
  uid: string;
};

type Prof = {
  uid: string;
};

export type { Book, Admin, Prof };

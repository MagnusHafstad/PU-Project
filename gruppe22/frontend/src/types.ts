type Book = {
  id: any;
  title: string;
  author: string;
  description: string;
  photo: string;
  avgUserRating?: number;
  numUserRatings: number;
};

type Admin = {
  uid: string;
};

export type { Book, Admin };

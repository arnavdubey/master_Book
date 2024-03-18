export interface Book {
    key: string;
    title: string;
    authors: string[];
    coverUrl: string;
    genre: string;
    publicationYear: number;
    description: string;
    isFavorite: boolean;
  }
  export type RootStackParamList = {
    navigate(arg0: string, arg1: { book: Book; }): void;
    BookList: undefined;
    BookDetails: { book: Book };
  };
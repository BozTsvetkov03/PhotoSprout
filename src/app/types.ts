export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image: string;
  fileName: string;
  author: {
    id: string;
    username: string;
  },
  likeCount?: number
}

export interface UserComment {
  id: string;
  authorId: string;
  authorUsername: string;
  authorAvatar?: string;
  body: string;
  createdAt: any;
}

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  image: string;
  fileName: string;
  author: {
    id: string;
    username: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  user: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  color: string;
}

export interface UpdateCategoryData {
  name?: string;
  color?: string;
}

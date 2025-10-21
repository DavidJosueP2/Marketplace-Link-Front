export interface VendorInfo {
  id: number;
  username: string;
}

export interface FavoritePublicationResponse {
  id: number;
  publicationId: number;
  code: string;
  name: string;
  description: string;
  price: number;
  type: string;
  availability: string;
  status: string;
  publicationDate: string;
  favoritedAt: string;
  categoryName: string;
  vendor: VendorInfo;
  imageUrls: string[];
}

export interface MessageResponse {
  message: string;
}

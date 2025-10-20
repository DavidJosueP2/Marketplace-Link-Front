export interface PublicationImageResponse {
  id: number;
  url: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface VendorResponse {
  id: number;
  username: string;
}

export interface PublicationResponse {
  id: number;
  code: string;
  type: "PRODUCT" | "SERVICE";
  name: string;
  description: string;
  price: number;
  availability: "AVAILABLE" | "UNAVAILABLE";
  status: "VISIBLE" | "HIDDEN";
  publicationDate: string;
  images: PublicationImageResponse[];
  category: CategoryResponse;
  vendor: VendorResponse;
}

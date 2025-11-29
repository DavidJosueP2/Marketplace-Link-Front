export interface PublicationImage {
  id: number;
  url: string;
}

export interface PublicationSummary {
  id: number;
  type: "PRODUCT" | "SERVICE";
  name: string;
  price: number;
  availability: "AVAILABLE" | "UNAVAILABLE";
  publicationDate: string;
  image: PublicationImage;
  canReport: boolean;
}



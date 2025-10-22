
export interface RequestUserReport {
  publicationId: number;
  reason: string;
  comment: string;
}

export interface ReportResponse {
  incidence_id: string;
  publication_id: number;
  message: string;
  created_at: Date;
  publication_status: string;
}

export interface RequestPagination {
  page?: number;
  size?: number;
}

export interface ApiResponseIncidence {
  content: IncidenceDetailResponse[]; // elementos actuales
  size: number; // tamano de la pagina actual  
  number: number; // pagina actual 
  totalElements: number; // total de registros
  totalPages: number; // total de paginas
  first: boolean; // es primera pagina
  last: boolean; // es ultima pagina
}

export interface IncidenceDetailResponse {
  incidence_id: string;
  status: string;
  incidence_decision: string;
  created_at: Date;
  auto_closed: boolean;
  moderator_comment: string;
  publication: SimplePublicationResponse;
  reports: SimpleReportResponse[];
}

export interface SimplePublicationResponse {
  id: number;
  name: string;
  description: string;
  status: string;
}

export interface SimpleReportResponse {
  id: number;
  reason: string;
  comment: string;
  created_at: Date;
  reporter: UserSimpleResponse;
}

export interface UserSimpleResponse {
  id: number;
  fullname: string;
  email: string;
}

export interface ClaimIncidenceResponse {
  incidence_id: string;
  message: string;
  moderator_name: string;
}

export interface RequestMakeDecision {
  incidence_id: string;
  comment: string;
  decision: "APPROVED" | "REJECTED";
}

export interface DecisionResponse {
  incidence_id: string;
  decision: string;
  status: string;
  message: string;
}

export interface RequestAppealIncidence {
  incidence_id: string;
  reason: string;
}
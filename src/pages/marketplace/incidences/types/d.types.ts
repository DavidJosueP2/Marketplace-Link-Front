
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
  content: IncidenceDetailsResponse[]; // elementos actuales
  size: number; // tamano de la pagina actual  
  number: number; // pagina actual 
  totalElements: number; // total de registros
  totalPages: number; // total de paginas
  first: boolean; // es primera pagina
  last: boolean; // es ultima pagina
}

export interface IncidenceDetailsResponse {
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

export interface ApiResponseAppeal {
  content: AppealSimpleDetailsResponse[];
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AppealDetailsResponse {
  id: number;
  status: string;
  seller: UserSimpleResponse;
  incidence: AppealIncidenceResponse;
  created_at: Date;
  final_decision: string;
  new_moderator: ModeratorInfo;
}

export interface AppealIncidenceResponse {
  incidence_id: string;
  moderator_comment: string;
  status: string;
  created_at: Date;
  previous_moderator: ModeratorInfo;
  publication: SimplePublicationResponse;
  reports: SimpleReportResponse[];
}

export interface AppealSimpleDetailsResponse {
  id: string;
  status: string;
  created_at: Date;
  final_decision: string;
  new_moderator: ModeratorInfo;
  seller: UserSimpleResponse;
}

export interface ModeratorInfo {
  id: number;
  fullname: string;
  email: string;
}

export interface IncidenceStatsResponse {
  total: number;
  pending: number;
  under_review: number;
  appealed: number;
  resolved: number;
}
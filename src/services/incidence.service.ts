import api from "./api";

/** Payload para reportar una publicación desde frontend */
export interface RequestUserReport {
  publicationId: number;
  reason: string; // SPAM | INAPPROPRIATE | SCAM | OTHER
  comment: string;
}

/** Respuesta genérica del endpoint de reportes */
export interface ReportResponse {
  incidence_id: string;
  publication_id: number;
  message: string;
  created_at: Date;
  publication_status: string;
}

const incidenceService = {

  reportByUser: async (payload: RequestUserReport): Promise<ReportResponse> => {
    const body = {
      publication_id: payload.publicationId,
      reason: payload.reason,
      comment: payload.comment,
    };

    const response = await api.post<ReportResponse>(`/api/incidences/report`, body);
    return response.data;
  },
};

export default incidenceService;

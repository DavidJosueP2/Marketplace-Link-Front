import type { ApiResponseIncidence, ClaimIncidenceResponse, DecisionResponse, IncidenceDetailsResponse, IncidenceStatsResponse, ReportResponse, RequestAppealIncidence, RequestMakeDecision, RequestPagination, RequestUserReport } from "@/pages/marketplace/incidences/types/d.types";
import api from "./api";


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

  fetchAllUnreviewed: async (pagination?: RequestPagination) => {
    const params: Record<string, any> = {
      page: pagination?.page ?? 0,
      size: pagination?.size ?? 10,
    };
    
    if (pagination?.startDate) {
      params.startDate = pagination.startDate;
    }
    
    if (pagination?.endDate) {
      params.endDate = pagination.endDate;
    }
    
    const response = await api.get<ApiResponseIncidence>(`/api/incidences/all`, {
      params,
    });
    return response.data;
  },

  fetchAllReviewed: async (pagination?: RequestPagination) => {
    const params: Record<string, any> = {
      page: pagination?.page ?? 0,
      size: pagination?.size ?? 10,
    };
    
    if (pagination?.startDate) {
      params.startDate = pagination.startDate;
    }
    
    if (pagination?.endDate) {
      params.endDate = pagination.endDate;
    }
    
    const response = await api.get<ApiResponseIncidence>(`/api/incidences/my`, {
      params,
    });
    return response.data;
  },

  fetchIncidenceById: async (publicUi: string) => {
    const response = await api.get<IncidenceDetailsResponse>(`/api/incidences/${publicUi}`);
    return response.data;
  },

  fetchIncidenceByIdForSeller: async (publicUi: string) => {
    const response = await api.get<IncidenceDetailsResponse>(`/api/incidences/s/${publicUi}`);
    return response.data;
  },

  claim: async (publicUi: string) => {
    const response = await api.post<ClaimIncidenceResponse>(`/api/incidences/claim`, {
      incidence_id: publicUi,
    });

    return response.data;
  },

  makeDecision: async (payload: RequestMakeDecision) => {
    const response = await api.post<DecisionResponse>(`/api/incidences/decision`, payload);
    return response.data;
  },

  appeal: async (payload: RequestAppealIncidence) => {
    const body = {
      incidence_id: payload.incidence_id,
      reason: payload.reason,
    };

    const response = await api.post(`/api/incidences/appeal`, body);
    return response.data;
  },

  fetchStats: async () => {
    const response = await api.get<IncidenceStatsResponse>(`/api/incidences/stats`);
    return response.data;
  },

};

export default incidenceService;

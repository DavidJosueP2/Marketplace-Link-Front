import type { ApiResponseAppeal, AppealDetailsResponse, RequestPagination } from "@/pages/marketplace/incidences/types/d.types";
import api from "./api";

export const appealService = {
  fetchMyAppeals: async (pagination?: RequestPagination) => {
    const response = await api.get<ApiResponseAppeal>(`/api/appeals/my`, {
      params: {
        page: pagination?.page ?? 0,
        size: pagination?.size ?? 10,
      },
    });
    return response.data;
  },

  fetchById: async (appealId: string | number) => {
    const response = await api.get<AppealDetailsResponse>(
      `/api/appeals/${appealId}`
    );

    return response.data;
  },

  makeDecision: async (payload: { appeal_id: number; final_decision: string }) => {
    const response = await api.post("/api/appeals/decision", payload);
    console.log("response", response);
    return response.data;
  },

};
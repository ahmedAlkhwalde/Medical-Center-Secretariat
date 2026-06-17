import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";

const SCHEDULE_QUERY_KEY = ["schedule", "all"];
const SPECIALTIES_QUERY_KEY = ["specialties"];
const DEFAULT_STALE_TIME = 1000 * 60 * 5;

const fetchSpecialties = async () => {
  const response = await apiClient.get("/admin/specializations");
  const list = response.data?.data ?? [];
  return list.map((spec) => ({
    uuid: spec.uuid,
    name: spec.name,
  }));
};

export const useSpecialtiesQuery = (options = {}) => {
  return useQuery({
    queryKey: SPECIALTIES_QUERY_KEY,
    queryFn: fetchSpecialties,
    staleTime: DEFAULT_STALE_TIME,
    ...options,
  });
};

const fetchSchedules = async (specializationUuid) => {
  const payload = {};
  if (specializationUuid) {
    payload.specialization_uuid = specializationUuid;
  }
  const response = await apiClient.post("/secretary/schudle/All", payload);
  return response.data.data;
};

export const useSchedulesQuery = (specializationUuid) => {
  return useQuery({
    queryKey: [...SCHEDULE_QUERY_KEY, specializationUuid],
    queryFn: () => fetchSchedules(specializationUuid),
    staleTime: 1000 * 60 * 5,
  });
};

const fetchEmptyDoctors = async () => {
  const response = await apiClient.get("/secretary/schudle/empty");
  return response.data.data;
};

export const useEmptyDoctorsQuery = () => {
  return useQuery({
    queryKey: ["schedule", "empty-doctors"],
    queryFn: fetchEmptyDoctors,
  });
};

// ─── الطفرات (Create / Update / Delete) ───
export const useCreateScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSchedule) => {
      const response = await apiClient.post("/secretary/schudle/store", newSchedule);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
    },
  });
};

export const useUpdateScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.put("/secretary/schudle/update", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
    },
  });
};

export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid) => {
      const response = await apiClient.delete(`/secretary/schudle/${uuid}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
    },
  });
};
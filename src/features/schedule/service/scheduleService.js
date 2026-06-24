import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../uiSlice";
import { data } from "react-router-dom";

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
  console.log("schdule nadim : ",specializationUuid,response.data)
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

// ─── طفرة الإضافة مع إشعارات ───
export const useCreateScheduleMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (newSchedule) => {
      const response = await apiClient.post("/secretary/schudle/store", newSchedule);
      console.log(response.data)
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
      dispatch(
        showSnackbar({
          message: data?.message || "تم إضافة الجدول بنجاح",
          variant: "success",
        })
      );
    },
    onError: (error) => {
      const msg = error.response.data.error || "فشل إضافة الجدول";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    },
  });
};

// ─── طفرة التحديث مع إشعارات ───
export const useUpdateScheduleMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.put("/secretary/schudle/update", payload);
      console.log(response.data)
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
      dispatch(
        showSnackbar({
          message: data?.message || "تم تحديث الجدول بنجاح",
          variant: "success",
        })
      );
    },
    onError: (error) => {
      console.log(error.response.data.error);
      const msg = error.response.data.error || "فشل تحديث الجدول";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    },
  });
};

// ─── طفرة الحذف مع إشعارات ───
export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (uuid) => {
      const response = await apiClient.delete(`/secretary/schudle/${uuid}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_QUERY_KEY });
      dispatch(
        showSnackbar({
          message: data?.message || "تم حذف الجدول بنجاح",
          variant: "success",
        })
      );
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "فشل حذف الجدول";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    },
  });
};
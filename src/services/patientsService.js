import { useQuery } from "@tanstack/react-query";
import apiClient from "../config/apiClient"; // نسخة الـ axios المهيأة بمشروعك

// هوك البحث عن المريض بالاسم أو الهاتف
export const usePatientSearchQuery = (query) => {
  return useQuery({
    queryKey: ["patientsSearch", query],
    queryFn: async () => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return { success: true, data: [] };
      const response = await apiClient.get(`/admin/search/patients`, {
        params: { query: trimmedQuery },
      });
      return response.data;
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 2, 
  });
};

// 💡 الهوك الجديد: جلب السجل الطبي للمريض عبر الـ uuid
export const usePatientHistoryQuery = (uuid) => {
  return useQuery({
    queryKey: ["patientHistory", uuid],
    queryFn: async () => {
      if (!uuid) return null;
      const response = await apiClient.get(`/secretary/${uuid}/appointments`);
      console.log(response.data);
      return response.data;
    },
    enabled: !!uuid, // يتم التفعيل فقط عند تمرير uuid صالح
    staleTime: 1000 * 60 * 5, // الاحتفاظ بالبيانات كـ Fresh لمدة 5 دقائق
  });
};
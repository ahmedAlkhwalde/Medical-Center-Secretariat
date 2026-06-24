import apiClient from '../../../config/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileData } from "../../auth/store/authSlice";
import { useDispatch } from "react-redux";
import { showSnackbar } from '../../../features/uiSlice'; // ✅ استيراد showSnackbar

export const fetchProfile = () => {
  return apiClient.get('/admin/profile/me');
};

export const updateProfile = (formData) => {
  return apiClient.post('/admin/profile/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const useProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile().then(res => res.data.data),
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => updateProfile(formData).then(res => res.data),
    onSuccess: (response) => {
      console.log("Profile updated successfully:", response);
      
      // تحديث بيانات المستخدم في الـ Redux Store
      if (response?.data) {
        dispatch(updateProfileData({
          name: response.data.name,
          image: response.data.image
        }));
      }
      
      // إبطال كاش البروفايل
      queryClient.invalidateQueries(['profile']);
      
      // ✅ إشعار نجاح من الخدمة نفسها
      dispatch(showSnackbar({
        message: response?.message || "تم تحديث الحساب بنجاح",
        variant: "success",
      }));
    },
    onError: (error) => {
      // ✅ إشعار خطأ من الخدمة نفسها
      dispatch(showSnackbar({
        message: error?.response?.data?.message || "فشل في تحديث البيانات",
        variant: "error",
      }));
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isLoading,
    updateError: updateMutation.error,
  };
};
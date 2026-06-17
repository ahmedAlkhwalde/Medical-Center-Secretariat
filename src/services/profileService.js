import apiClient from '../config/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileData } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
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

    onSuccess: (formData) => {
        console.log("Profile updated successfully:", formData);
      dispatch(updateProfileData({
        name: formData.data.name,
        image: formData.data.image
      }));
      queryClient.invalidateQueries(['profile']);
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
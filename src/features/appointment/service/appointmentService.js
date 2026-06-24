import apiClient from "../../../config/apiClient"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux"; 
import { showSnackbar } from "../../uiSlice"; 
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export const appointmentService = {
  getDoctorAppointments: async (doctorUuid, selectedDate) => {
    const response = await apiClient.post(`/secretary/appointment/doctor/${doctorUuid}`, { date: selectedDate });
    return response.data;
  },

  updateToWaiting: async (appointmentUuid) => {
    const response = await apiClient.patch(`/secretary/appointment/${appointmentUuid}/status`);
    return response.data;
  },

  updateToPaid: async (appointmentUuid) => {
    const response = await apiClient.patch(`/secretary/appointment/${appointmentUuid}/paid`);
    return response.data;
  },

  createAppointment: async ({ patientUuid, appointmentData }) => {
    const body = {
      date: appointmentData.date,
      time: appointmentData.time,
      DoctorUuid: appointmentData.DoctorUuid, 
      Type: appointmentData.Type,
    };
    const response = await apiClient.post(`/secretary/add-appointment/${patientUuid}`, body);
    return response.data;
  },

  searchPatients: async (searchTerm) => {
    const response = await apiClient.post(`/secretary/search`, { search: searchTerm });
    return response.data; 
  },

  createPatient: async (patientData) => {
    const response = await apiClient.post(`/secretary/create/patients`, patientData);
    return response.data; 
  },

  updatePatient: async ({ uuid, patientData }) => {
    const response = await apiClient.put(`/secretary/update/${uuid}`, patientData);
    return response.data; 
  },

  deletePatient: async (uuid) => {
    const response = await apiClient.delete(`/secretary/delete/${uuid}`);
    return response.data;
  },

  deleteAppointment: async (appointmentUuid) => {
    const response = await apiClient.delete(`/secretary/appointment/${appointmentUuid}`);
    return response.data;
  },
};

// --- Custom Hooks ---

export const useGetDoctorAppointments = (doctorUuid, selectedDate) => {
  return useQuery({
    queryKey: ["doctorAppointments", doctorUuid, selectedDate],
    queryFn: () => appointmentService.getDoctorAppointments(doctorUuid, selectedDate),
    enabled: !!doctorUuid && !!selectedDate,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchPatients = (searchTerm) => {
  return useQuery({
    queryKey: ["searchPatients", searchTerm],
    queryFn: () => appointmentService.searchPatients(searchTerm),
    enabled: !!searchTerm && searchTerm.trim().length > 0, 
    retry: false,
  });
};

export const useUpdateToWaitingMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: appointmentService.updateToWaiting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      dispatch(showSnackbar({ message: "تم نقل الموعد إلى قائمة الانتظار بنجاح", variant: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || "فشل نقل الموعد إلى الانتظار";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    }
  });
};

export const useUpdateToPaidMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: appointmentService.updateToPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      dispatch(showSnackbar({ message: "تمت عملية تحصيل الدفع وإكمال الموعد بنجاح", variant: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || "فشلت عملية الدفع والتحصيل";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    }
  });
};

export const useCreatePatientMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: appointmentService.createPatient,
    onSuccess: () => {
      dispatch(showSnackbar({ message: "تم تسجيل المريض الجديد بنجاح", variant: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || "فشل تسجيل المريض الجديد";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    }
  });
};

export const useUpdatePatientMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: appointmentService.updatePatient,
    onSuccess: (data) => {
      const successMsg = data?.message || "تم تحديث بيانات المريض بنجاح";
      dispatch(showSnackbar({ message: successMsg, variant: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || "فشل تحديث بيانات المريض";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    }
  });
};

export const useDeletePatientMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: appointmentService.deletePatient,
    onSuccess: () => {
      dispatch(showSnackbar({ message: "تم حذف بطاقة المريض بنجاح", variant: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "فشل حذف بطاقة المريض";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    }
  });
};

export const useAddAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schedule", "all"] });
      if (variables.appointmentData?.DoctorUuid) {
        queryClient.invalidateQueries({
          queryKey: ["doctorAppointments", variables.appointmentData.DoctorUuid],
        });
      }
      dispatch(showSnackbar({ message: "تم حجز وتثبيت الموعد بنجاح", variant: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "فشل تسجيل الموعد الجديد";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    }
  });
};

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: appointmentService.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
      dispatch(showSnackbar({ message: "تم إلغاء وحذف الموعد بنجاح", variant: "success" }));
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "فشل إلغاء وحذف الموعد";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    }
  });
};

const editAppointmentApi = async ({ id, updatedData }) => {
  const response = await apiClient.put(`/secretary/edit-appointment/${id}`, updatedData);
  return response.data;
};

export const useUpdateAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: editAppointmentApi,
    onSuccess: (data) => {
      console.log("تم التعديل بنجاح:", data);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      dispatch(showSnackbar({ message: "تم تعديل الموعد بنجاح", variant: "success" }));
    },
    onError: (error) => {
      console.error("حدث خطأ أثناء التعديل:", error);
      const msg = error?.response?.data?.message || "فشل تعديل الموعد";
      dispatch(showSnackbar({ message: msg, variant: "error" }));
    }
  });
};

export const useRealTimeAllAppointments = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("📡 [DEBUG] جاري بدء الاستماع الحي لجميع المواعيد في النظام...");
    const q = query(collection(db, "appointments"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          console.log("🔔 [DEBUG] تحديث فوري! تم رصد ${querySnapshot.docs.length} موعد في النظام.");
          queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
          queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
          dispatch(showSnackbar({ message: "تم تحديث المواعيد في النظام فوراً", variant: "success" }));
        }
      },
      (error) => console.error("❌ [Firebase RealTime Error]:", error)
    );

    return () => {
      console.log("🗑 [RealTime] تم إيقاف الاستماع العام للمواعيد.");
      unsubscribe();
    };
  }, [queryClient, dispatch]);
};
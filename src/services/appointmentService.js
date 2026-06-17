import apiClient from "../config/apiClient"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux"; 
import { showSnackbar } from "../features/uiSlice"; 
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const appointmentService = {
  // --- مواعيد الطبيب ---
  // التابع الأول: جلب مواعيد طبيب معين بواسطة الـ UUID الخاص به
  getDoctorAppointments: async (doctorUuid,selectedDate) => {
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

  // التابع الثاني: إضافة حجز جديد للمريض باستخدام الـ patientUuid في الرابط والـ body المطلوب
  createAppointment: async ({ patientUuid, appointmentData }) => {
    const body = {
      date: appointmentData.date,
      time: appointmentData.time,
      DoctorUuid: appointmentData.DoctorUuid, 
      Type: appointmentData.Type,
    };
    const response = await apiClient.post(`/secretary/add-appointment/${patientUuid}`, body);
    console.log("Response from createAppointment:", response.data);
    return response.data;
  },

  // --- إدارة وتفتيش المرضى ---
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
      const msg = error?.response?.data?.message || "فشل نقل الموعد إلى الانتظار";
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
      const msg = error?.response?.data?.message || "فشلت عملية الدفع والتحصيل";
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
      const msg = error?.response?.data?.message || "فشل تسجيل المريض الجديد";
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
      const msg = error?.response?.data?.message || "فشل تحديث بيانات المريض";
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
    // استدعاء التابع المركزي الجديد وتمرير العناصر بداخله
    mutationFn: appointmentService.createAppointment,
    onSuccess: (data, variables) => {
      // 1. تحديث كاش المواعيد ليعاد فحص الفترات
      queryClient.invalidateQueries({ queryKey: ["schedule", "all"] });
      
      // 2. تحديث الكاش الفوري لمواعيد هذا الطبيب بناءً على الاسم الموحد "doctorAppointments"
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
      // إعادة جلب مواعيد الطبيب تلقائياً لتحديث الواجهة فوراً بعد الحذف
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

  return useMutation({
    mutationFn: editAppointmentApi,
    
    // عند نجاح التعديل، نقوم بتحديث الكاش تلقائياً لتبديل البيانات في الواجهة فوراً
    onSuccess: (data) => {
      console.log("تم التعديل بنجاح:", data);
      
      // قم باستبدال 'appointments' بالـ Query Key الخاص بجلب المواعيد لديك
      queryClient.invalidateQueries({ queryKey: ['appointments'] }); 
    },
    onError: (error) => {
      console.error("حدث خطأ أثناء التعديل:", error);
    }
  });
};








// هوك الاستماع الحي لمواعيد الطبيب من Firestore
export const useRealTimeAllAppointments = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("📡 [DEBUG] جاري بدء الاستماع الحي لجميع المواعيد في النظام...");

    // 1. الاستماع للكولكشن بالكامل دون تقييدها بطبيب معين
    const q = query(collection(db, "appointments"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          console.log("🔔 [DEBUG] تحديث فوري! تم رصد ${querySnapshot.docs.length} موعد في النظام.");
          
          // 2. تحديث الكاش العام للمواعيد لكي تظهر التعديلات عند كل المستخدمين
          queryClient.invalidateQueries({
            queryKey: ["allAppointments"], // يفضل استخدام مفتاح عام هنا
          });

          // يمكنك أيضاً تحديث كاش طبيب محدد إذا كان النظام يحتاج ذلك ديناميكياً
          queryClient.invalidateQueries({
            queryKey: ["doctorAppointments"],
          });

          // إشعار واجهة المستخدم بالتحديث
          dispatch(showSnackbar({ message: "تم تحديث المواعيد في النظام فوراً", variant: "success" }));
        }
      },
      (error) => console.error("❌ [Firebase RealTime Error]:", error)
    );

    // إلغاء الاشتراك عند إغلاق الصفحة لمنع تسريب الذاكرة
    return () => {
      console.log("🗑 [RealTime] تم إيقاف الاستماع العام للمواعيد.");
      unsubscribe();
    };
  }, [queryClient, dispatch]); // أزلنا doctorUuid من المصفوفة لأنه لم يعد شرطاً للاستماع
};



// import apiClient from "../config/apiClient";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useDispatch } from "react-redux";
// import { showSnackbar } from "../features/uiSlice";
// import { useEffect } from "react";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "../firebase";
 
// export const appointmentService = {
//   // --- مواعيد الطبيب ---
//   // التابع الأول: جلب مواعيد طبيب معين بواسطة الـ UUID الخاص به
//   getDoctorAppointments: async (doctorUuid, selectedDate) => {
//     const response = await apiClient.post(`/secretary/appointment/doctor/${doctorUuid}`, { date: selectedDate });
//     return response.data;
//   },
 
//   updateToWaiting: async (appointmentUuid) => {
//     const response = await apiClient.patch(`/secretary/appointment/${appointmentUuid}/status`);
//     return response.data;
//   },
 
//   updateToPaid: async (appointmentUuid) => {
//     const response = await apiClient.patch(`/secretary/appointment/${appointmentUuid}/paid`);
//     return response.data;
//   },
 
//   // التابع الثاني: إضافة حجز جديد للمريض باستخدام الـ patientUuid في الرابط والـ body المطلوب
//   createAppointment: async ({ patientUuid, appointmentData }) => {
//     const body = {
//       date: appointmentData.date,
//       time: appointmentData.time,
//       DoctorUuid: appointmentData.DoctorUuid,
//       Type: appointmentData.Type,
//     };
//     const response = await apiClient.post(`/secretary/add-appointment/${patientUuid}`, body);
//     console.log("Response from createAppointment:", response.data);
//     return response.data;
//   },
 
//   // --- إدارة وتفتيش المرضى ---
//   searchPatients: async (searchTerm) => {
//     const response = await apiClient.post(`/secretary/search`, { search: searchTerm });
//     return response.data;
//   },
 
//   createPatient: async (patientData) => {
//     const response = await apiClient.post(`/secretary/create/patients`, patientData);
//     return response.data;
//   },
 
//   updatePatient: async ({ uuid, patientData }) => {
//     const response = await apiClient.put(`/secretary/update/${uuid}`, patientData);
//     return response.data;
//   },
 
//   deletePatient: async (uuid) => {
//     const response = await apiClient.delete(`/secretary/delete/${uuid}`);
//     return response.data;
//   },
 
//   deleteAppointment: async (appointmentUuid) => {
//     const response = await apiClient.delete(`/secretary/appointment/${appointmentUuid}`);
//     return response.data;
//   },
// };
 
// // --- Custom Hooks ---
 
// export const useGetDoctorAppointments = (doctorUuid, selectedDate) => {
//   return useQuery({
//     queryKey: ["doctorAppointments", doctorUuid, selectedDate],
//     queryFn: () => appointmentService.getDoctorAppointments(doctorUuid, selectedDate),
//     enabled: !!doctorUuid && !!selectedDate,
//     staleTime: 1000 * 60 * 5,
//   });
// };
 
// export const useSearchPatients = (searchTerm) => {
//   return useQuery({
//     queryKey: ["searchPatients", searchTerm],
//     queryFn: () => appointmentService.searchPatients(searchTerm),
//     enabled: !!searchTerm && searchTerm.trim().length > 0,
//     retry: false,
//   });
// };
 
// // ✅ لا يوجد أي invalidateQueries لمواعيد الطبيب — التحديث يتم فقط عبر Firestore Realtime
// export const useUpdateToWaitingMutation = () => {
//   const dispatch = useDispatch();
//   return useMutation({
//     mutationFn: appointmentService.updateToWaiting,
//     onSuccess: () => {
//       dispatch(showSnackbar({ message: "تم نقل الموعد إلى قائمة الانتظار بنجاح", variant: "success" }));
//     },
//     onError: (error) => {
//       const msg = error?.response?.data?.message || "فشل نقل الموعد إلى الانتظار";
//       dispatch(showSnackbar({ message: msg, variant: "error" }));
//     }
//   });
// };
 
// // ✅ لا يوجد أي invalidateQueries لمواعيد الطبيب — التحديث يتم فقط عبر Firestore Realtime
// export const useUpdateToPaidMutation = () => {
//   const dispatch = useDispatch();
//   return useMutation({
//     mutationFn: appointmentService.updateToPaid,
//     onSuccess: () => {
//       dispatch(showSnackbar({ message: "تمت عملية تحصيل الدفع وإكمال الموعد بنجاح", variant: "success" }));
//     },
//     onError: (error) => {
//       const msg = error?.response?.data?.message || "فشلت عملية الدفع والتحصيل";
//       dispatch(showSnackbar({ message: msg, variant: "error" }));
//     }
//   });
// };
 
// export const useCreatePatientMutation = () => {
//   const dispatch = useDispatch();
//   return useMutation({
//     mutationFn: appointmentService.createPatient,
//     onSuccess: () => {
//       dispatch(showSnackbar({ message: "تم تسجيل المريض الجديد بنجاح", variant: "success" }));
//     },
//     onError: (error) => {
//       const msg = error?.response?.data?.message || "فشل تسجيل المريض الجديد";
//       dispatch(showSnackbar({ message: msg, variant: "error" }));
//     }
//   });
// };
 
// export const useUpdatePatientMutation = () => {
//   const dispatch = useDispatch();
//   return useMutation({
//     mutationFn: appointmentService.updatePatient,
//     onSuccess: (data) => {
//       const successMsg = data?.message || "تم تحديث بيانات المريض بنجاح";
//       dispatch(showSnackbar({ message: successMsg, variant: "success" }));
//     },
//     onError: (error) => {
//       const msg = error?.response?.data?.message || "فشل تحديث بيانات المريض";
//       dispatch(showSnackbar({ message: msg, variant: "error" }));
//     }
//   });
// };
 
// export const useDeletePatientMutation = () => {
//   const dispatch = useDispatch();
//   return useMutation({
//     mutationFn: appointmentService.deletePatient,
//     onSuccess: () => {
//       dispatch(showSnackbar({ message: "تم حذف بطاقة المريض بنجاح", variant: "success" }));
//     },
//     onError: (error) => {
//       const msg = error?.response?.data?.message || "فشل حذف بطاقة المريض";
//       dispatch(showSnackbar({ message: msg, variant: "error" }));
//     }
//   });
// };
 
// // ✅ لا يوجد أي invalidateQueries أو setQueryData هنا — التحديث يتم فقط عبر Firestore Realtime
// export const useAddAppointmentMutation = () => {
//   const dispatch = useDispatch();
//   return useMutation({
//     // استدعاء التابع المركزي الجديد وتمرير العناصر بداخله
//     mutationFn: appointmentService.createAppointment,
//     onSuccess: () => {
//       dispatch(showSnackbar({ message: "تم حجز وتثبيت الموعد بنجاح", variant: "success" }));
//     },
//     onError: (error) => {
//       const msg = error?.response?.data?.message || "فشل تسجيل الموعد الجديد";
//       dispatch(showSnackbar({ message: msg, variant: "error" }));
//     }
//   });
// };
 
// // ✅ لا يوجد أي invalidateQueries هنا — التحديث (الحذف من القائمة) يتم فقط عبر Firestore Realtime
// export const useDeleteAppointmentMutation = () => {
//   const dispatch = useDispatch();
//   return useMutation({
//     mutationFn: appointmentService.deleteAppointment,
//     onSuccess: () => {
//       dispatch(showSnackbar({ message: "تم إلغاء وحذف الموعد بنجاح", variant: "success" }));
//     },
//     onError: (error) => {
//       const msg = error?.response?.data?.message || "فشل إلغاء وحذف الموعد";
//       dispatch(showSnackbar({ message: msg, variant: "error" }));
//     }
//   });
// };
 
// const editAppointmentApi = async ({ id, updatedData }) => {
//   const response = await apiClient.put(`/secretary/edit-appointment/${id}`, updatedData);
//   return response.data;
// };
 
// // ✅ لا يوجد أي invalidateQueries هنا — التحديث (نقل الموعد) يتم فقط عبر Firestore Realtime
// export const useUpdateAppointmentMutation = () => {
//   const dispatch = useDispatch();
 
//   return useMutation({
//     mutationFn: editAppointmentApi,
//     onSuccess: (data) => {
//       console.log("تم التعديل بنجاح:", data);
//     },
//     onError: (error) => {
//       console.error("حدث خطأ أثناء التعديل:", error);
//       const msg = error?.response?.data?.message || "فشل تعديل الموعد";
//       dispatch(showSnackbar({ message: msg, variant: "error" }));
//     }
//   });
// };
 
// // ✅ تحويل صيغة date_time القادمة من Firestore إلى الصيغة المستخدمة في الواجهة (YYYY-MM-DD HH:mm:ss)
// const normalizeDateTime = (rawDateTime, fallbackDate) => {
//   if (!rawDateTime) return `${fallbackDate} 00:00:00`;
//   return String(rawDateTime).replace("T", " ");
// };
 
// /**
//  * 🚀 هوك الاستماع اللحظي (Realtime) لمواعيد الطبيب من Firestore.
//  *
//  * يعتمد بالكامل على Firestore كمصدر للحقيقة لتحديث قائمة المواعيد:
//  * - لا يستخدم invalidateQueries أو refetch إطلاقاً.
//  * - يحدّث كاش React Query مباشرة عبر setQueryData (upsert/remove) بحسب uuid.
//  * - يُصفّى التحديثات بحسب doctorUuid (user_uuid) و selectedDate (date_time)
//  *   لضمان تحديث القائمة المعروضة فقط دون أي تأثير على تواريخ/أطباء آخرين.
//  *
//  * يجب استدعاؤه مع doctorUuid و selectedDate نفس قيم useGetDoctorAppointments
//  * حتى يتطابق مفتاح الكاش المستهدف بالتحديث.
//  */
// export const useRealTimeDoctorAppointments = (doctorUuid, selectedDate) => {
//   const queryClient = useQueryClient();
 
//   // ✅ نفس مفتاح الكاش المستخدم في useGetDoctorAppointments
//   const appointmentsQueryKey = ["doctorAppointments", doctorUuid, selectedDate];
 
//   // ✅ تاريخ اليوم المستهدف بصيغة YYYY-MM-DD لتصفية مستندات Firestore
//   const targetDateISO = (() => {
//     if (!selectedDate) return "";
//     if (typeof selectedDate === "string") return selectedDate.split(" ")[0];
//     if (selectedDate instanceof Date) {
//       const yyyy = selectedDate.getFullYear();
//       const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
//       const dd = String(selectedDate.getDate()).padStart(2, "0");
//       return `${yyyy}-${mm}-${dd}`;
//     }
//     return "";
//   })();
 
//   useEffect(() => {
//     if (!doctorUuid || !selectedDate) return;
 
//     console.log("🔍 [Realtime] جاري الاستماع لمواعيد الطبيب:", doctorUuid, "بتاريخ", targetDateISO);
 
//     const q = query(
//       collection(db, "appointments"),
//       where("user_uuid", "==", doctorUuid),
//     );
 
//     const unsubscribe = onSnapshot(
//       q,
//       (querySnapshot) => {
//         querySnapshot.docChanges().forEach((change) => {
//           const docData = change.doc.data();
//           const docUuid = docData.uuid || docData.id || change.doc.id;
 
//           const cleanDateTime = normalizeDateTime(docData.date_time, targetDateISO);
//           const [docDatePart] = cleanDateTime.split(" ");
 
//           // تجاهل أي مستند لا يخص التاريخ المعروض حالياً
//           if (targetDateISO && docDatePart && docDatePart !== targetDateISO) {
//             return;
//           }
 
//           if (change.type === "added" || change.type === "modified") {
//             const appointmentData = {
//               uuid: docUuid,
//               name: docData.name,
//               nick_name: docData.nick_name || docData.nickname || "",
//               phone: docData.phone || "لا يوجد هاتف",
//               age: docData.age || "",
//               gender: docData.gender,
//               status: docData.status,
//               date_time: cleanDateTime,
//             };
 
//             queryClient.setQueryData(appointmentsQueryKey, (old) => {
//               const oldAppointments = old?.appointments || [];
//               const existingIndex = oldAppointments.findIndex(
//                 (app) => app.uuid === appointmentData.uuid,
//               );
 
//               let newAppointments;
//               if (existingIndex !== -1) {
//                 newAppointments = [...oldAppointments];
//                 newAppointments[existingIndex] = {
//                   ...newAppointments[existingIndex],
//                   ...appointmentData,
//                 };
//               } else {
//                 newAppointments = [...oldAppointments, appointmentData];
//               }
 
//               return {
//                 ...(old || {}),
//                 appointments: newAppointments,
//               };
//             });
//           } else if (change.type === "removed") {
//             queryClient.setQueryData(appointmentsQueryKey, (old) => {
//               if (!old) return old;
//               const oldAppointments = old.appointments || [];
//               return {
//                 ...old,
//                 appointments: oldAppointments.filter(
//                   (app) => app.uuid !== docUuid,
//                 ),
//               };
//             });
//           }
//         });
//       },
//       (error) => console.error("❌ [Firebase Realtime Error]:", error),
//     );
 
//     return () => {
//       console.log("🗑 [Realtime] تم إلغاء اشتراك Firestore لمواعيد الطبيب.");
//       unsubscribe();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [doctorUuid, selectedDate, targetDateISO]);
// };







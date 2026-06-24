import { useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  ArrowBack,
  Email,
  LocalHospital,
  MonetizationOn,
  AccessTime,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearSelectedPatient } from "../store/patientsSlice";
import { usePatientHistoryQuery } from "../service/patientsService";

// دالة لتنسيق اسم الطبيب
const formatDoctorName = (name = "") => {
  const trimmedName = name.trim();
  return trimmedName.startsWith("د.") ? trimmedName : `د. ${trimmedName}`;
};

// دالة لمواءمة جنس المريض وعرضه بالعربية
const formatGender = (gender = "") => {
  return gender.toLowerCase() === "female" ? "أنثى" : "ذكر";
};

// دالة لتنسيق حالة الموعد مع الألوان المتوافقة
const getStatusDetails = (status = "") => {
  switch (status.toLowerCase()) {
    case "has visited":
      return {
        text: "تمت الزيارة",
        classes:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "is waiting":
      return {
        text: "في الانتظار",
        classes:
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "has changed":
      return {
        text: "تم التعديل / التأجيل",
        classes:
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    default:
      return {
        text: "غير محدد",
        classes:
          "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
      };
  }
};

// تنسيق العملة المالي
const formatCurrency = (amount) => {
  return amount ? `${amount.toLocaleString("ar-SY")} ل.س` : "غير محدد";
};

const PatientRecordDetail = ({ patient, onBack }) => {
  const dispatch = useDispatch();

  // استدعاء السجل الطبي للمريض من الـ API
  const { data: historyResponse, isLoading } = usePatientHistoryQuery(
    patient.uuid,
  );

  // بناءً على الـ JSON الراجع، الرد هو مصفوفة مباشرة من المواعيد
  const visits = Array.isArray(historyResponse)
    ? historyResponse
    : historyResponse?.data || [];

  // استخراج معلومات المريض الأساسية من أول موعد راجع، أو استخدام الـ prop كاحتياط
  const patientInfo = useMemo(() => {
    if (visits.length > 0) {
      return {
        name: visits[0].patient_name,
        age: visits[0].age,
        gender: visits[0].gender,
      };
    }
    return {
      name: patient?.name || "مريض غير معروف",
      age: patient?.age || "--",
      gender: patient?.gender || "",
    };
  }, [visits, patient]);

  const handleBack = () => {
    dispatch(clearSelectedPatient());
    onBack?.();
  };

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      {/* رأس الصفحة الثابت */}
      <div className="sticky -top-4 z-10 mb-6 -mx-3 px-3 py-4 backdrop-blur-md theme-surface-90 border-b theme-border -mx-2 -my-4 sm:-mx-4 md:-mx-8 lg:-mx-10">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl theme-surface-80 theme-text hover:theme-surface-95 transition-colors border theme-border"
              aria-label="عودة"
            >
              <ArrowBack />
            </button>

            <div>
              <h1 className="text-2xl font-black theme-text">
                {patientInfo.name}
              </h1>
              <div className="flex items-center gap-3 text-sm theme-text-muted mt-1 font-medium">
                <span>العمر: {patientInfo.age} سنة</span>
                <span>•</span>
                <span>الجنس: {formatGender(patientInfo.gender)}</span>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-purple-500/10 to-blue-500/10 border theme-border px-4 py-2 rounded-2xl text-center sm:text-right self-start sm:self-auto">
            <p className="text-xs theme-text-muted font-bold">
              إجمالي المواعيد والزيارات
            </p>
            <p className="text-2xl font-black theme-text-accent">
              {isLoading ? "..." : visits.length}
            </p>
          </div>
        </div>
      </div>

      {/* منطقة عرض السجلات */}
      <div className="max-w-5xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <CircularProgress
              size={40}
              color="inherit"
              className="theme-text-muted"
            />
            <p className="theme-text-muted text-sm animate-pulse font-bold">
              جاري جلب السجل الطبي المفصل للمريض...
            </p>
          </div>
        ) : visits.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {visits.map((visit) => {
                const statusInfo = getStatusDetails(visit.status);
                return (
                  <Motion.div
                    key={visit.appointment_uuid}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="group relative overflow-hidden rounded-3xl theme-surface-90 p-5 md:p-6 border theme-border hover:shadow-xl transition-all duration-300"
                  >
                    {/* خط ديكور جانبي ملون */}
                    <div className="absolute right-0 top-0 w-1.5 h-full bg-linear-to-b from-blue-500 via-purple-500 to-transparent"></div>

                    <div className="flex flex-col gap-4">
                      {/* السطر الأول: بيانات الطبيب الرئيسية والحالة */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b theme-border pb-3">
                        <div>
                          <h3 className="text-xl font-black theme-text mb-1">
                            {formatDoctorName(visit.doctor_name)}
                          </h3>
                          <div className="flex items-center gap-2 text-sm theme-text-accent font-bold">
                            <LocalHospital fontSize="inherit" />
                            <span>تخصص {visit.doctor_specialty?.name}</span>
                          </div>
                        </div>

                        {/* شارة الحالة المدعومة بالحدود والألوان */}
                        <span
                          className={`self-start sm:self-auto text-xs font-black px-4 py-1.5 rounded-full border ${statusInfo.classes}`}
                        >
                          {statusInfo.text}
                        </span>
                      </div>

                      {/* السطر الثاني: معلومات العيادة والتواصل */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex flex-col gap-1.5">
                          <p className="theme-text font-medium">
                            <span className="theme-text-muted">
                              المقر والعيادة:
                            </span>{" "}
                            {visit.doctor_clinic}
                          </p>
                          {visit.doctor_email && (
                            <p className="flex items-center gap-1.5 text-xs theme-text-muted">
                              <Email fontSize="inherit" />
                              <span>{visit.doctor_email}</span>
                            </p>
                          )}
                        </div>

                        {/* القسم المالي: أسعار الكشف والاستشارة للعيادة */}
                        <div className="bg-linear-to-l from-gray-500/5 to-transparent p-3 rounded-2xl border theme-border flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <MonetizationOn
                              className="theme-text-muted"
                              fontSize="small"
                            />
                            <div>
                              <p className="text-[11px] theme-text-muted font-bold">
                                رسوم الفحص (الكشفية)
                              </p>
                              <p className="text-sm font-black theme-text">
                                {formatCurrency(
                                  visit.doctor_specialty?.checker,
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
                          <div>
                            <p className="text-[11px] theme-text-muted font-bold">
                              رسوم المراجعة
                            </p>
                            <p className="text-sm font-black theme-text-muted">
                              {formatCurrency(visit.doctor_specialty?.review)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* السطر الثالث: تفاصيل توقيت الموعد */}
                      <div className="p-3.5 rounded-2xl theme-surface-80 border theme-border flex items-center gap-3 mt-1">
                        <AccessTime
                          className="theme-text-accent"
                          fontSize="small"
                        />
                        <div className="text-right">
                          <p className="text-[11px] theme-text-muted font-bold">
                            توقيت وجدولة الموعد
                          </p>
                          <p className="text-sm font-bold theme-text">
                            {new Date(
                              visit.date_time.replace(/-/g, "/"),
                            ).toLocaleDateString("ar-SA", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        ) : (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 theme-surface-90 rounded-3xl border theme-border"
          >
            <p className="theme-text-muted text-base font-medium">
              لا توجد مواعيد سابقة أو سجلات طبية راجعة لهذا المريض حالياً.
            </p>
          </Motion.div>
        )}
      </div>
    </Motion.div>
  );
};

export default PatientRecordDetail;

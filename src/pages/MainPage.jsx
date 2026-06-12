import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import SchedulePage from "./schedule/SchedulePage";
import PatientsRecordsPage from "./patients/PatientsRecordsPage";
import BookingModal from "../pages/appointment/appointmentPage";
import ChatList from "../pages/conversation/ChatList";
import Conversation from "../pages/conversation/Conversation"; 

export default function MainPage() {
  return (
    <div className="w-full h-full">
      <Layout>
        <Routes>
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="patients-records" element={<PatientsRecordsPage />} />
          <Route path="appointments" element={<BookingModal />} />
          <Route path="conversations" element={<ChatList isDark={true} />} />
          <Route path="conversations/view/:id" element={<Conversation />} />
          <Route index element={<BookingModal />} />
          <Route path="appointments" element={<BookingModal />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="patients-records" element={<PatientsRecordsPage />} />
          {/* <Route path="dashboard" element={<DashboardPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="specialties" element={<SpecialtiesPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="doctors/:doctorId" element={<DoctorDetailPage />} />
          <Route path="clinics" element={<ClinicsPage />} />
          <Route path="secretary" element={<SecretariesPage />} />
          <Route path="patients-records" element={<PatientsRecordsPage />} /> */}
        </Routes>
      </Layout>
    </div>
  );
}




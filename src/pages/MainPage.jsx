import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import SchedulePage from "./schedule/SchedulePage";
import PatientsRecordsPage from "./patients/PatientsRecordsPage";
import BookingModal from "../pages/appointment/appointmentPage";
import ChatList from "../pages/conversation/ChatList";
import Conversation from "../pages/conversation/Conversation"; 

export default function MainPage() {
  return (
    // مجرد حاوية تأخذ كامل الأبعاد لملء الـ Layout
    <div className="w-full h-full">
      <Layout>
        <Routes>
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="patients-records" element={<PatientsRecordsPage />} />
          <Route path="appointments" element={<BookingModal />} />
          <Route path="conversations" element={<ChatList isDark={true} />} />
          <Route path="conversations/view/:id" element={<Conversation />} />
        </Routes>
      </Layout>
    </div>
  );
}




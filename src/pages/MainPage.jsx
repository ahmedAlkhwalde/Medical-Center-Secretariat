import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import SchedulePage from "./schedule/SchedulePage";
import PatientsRecordsPage from "./patients/PatientsRecordsPage";

export default function MainPage() {
  return (
    <div>
      <Layout>
        <Routes>
          {/* <Route index element={<SchedulePage />} /> */}
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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Error, Landing, ProtectedRoute, Register } from './pages';
import { AddJob, AllJobs, Profile, SharedLayout, Stats, HRDashboard, JobMarket, MyApplications } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
          <Route path="hr-dashboard" element={<HRDashboard />} />
          <Route path="job-market" element={<JobMarket />} />
          <Route path="my-applications" element={<MyApplications />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './page/HomePage';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage';
import PatientDashboard from './page/PatientDashboard';
import ProtectedRoute from './routes/ProtectedRoutes';
import BookAppointmentPage from './page/BookAppointmentPage';
import PatientAppointmentsPage from './page/PatientAppointmentsPage';
import EditAppointmentPage from './page/EditAppointmentPage'
import DentistSchedulePage from './page/DentistSchedulePage';
import DentistDashboard from './page/DentistDashboard';
import ManageAvailabilityPage from './page/ManageAvailabilityPage';
import NotFoundPage from './page/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Common/Navbar';

function App() {
    // I'e added comments all over the place, but if you still don't get something, just ask me
    // - Drei
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container"> {/* Optional global container for padding/layout */}
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Patient Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
                            <Route path="/patient/dashboard" element={<PatientDashboard />} />
                            <Route path="/patient/book-appointment" element={<BookAppointmentPage />} />
                            <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
                            <Route path="/patient/appointment/edit/:appointmentId" element={<EditAppointmentPage />} />
                        </Route>

                        {/* Dentist Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['DENTIST']} />}>
                            <Route path="/dentist/dashboard" element={<DentistDashboard />} />
                            <Route path="/dentist/schedule" element={<DentistSchedulePage />} />
                            <Route path="/dentist/manage-availability" element={<ManageAvailabilityPage />} />
                        </Route>

                        {/* Catch-all Not Found Route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
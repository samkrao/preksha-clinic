import React from "react";
import Navbar from "../Components/Navbar";
import AppointmentForm from "../Components/AppointmentForm";
import Footer from "../Components/Footer";
function Appointment() {
  return (
    <div className="home-section">
      <Navbar />
      <AppointmentForm />
      <Footer />
    </div>
  );
  
}

export default Appointment;

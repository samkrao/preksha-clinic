import React from "react";
import DoctorCard from "./DoctorCard";
import profile1 from "../Assets/doc.png";
import "../Styles/Doctors.css";

function Doctors() {
  return (
    <div className="doctor-section" id="doctors">
      <div className="dt-title-content">
        <h3 className="dt-title">
          <span>Meet Our Doctor(s)</span>
        </h3>

        <p className="dt-description">
          Dr. Manisha Shinde BHMS with 10+ years of experience in practising Homoeopathy medicine. 
        </p>
      </div>

      <div className="dt-cards-content">
        <DoctorCard
          img={profile1}
          name="Dr. Manisha Shinde"
          title="Homoeopathy physician"
          stars="4.9"
          reviews="20"
        />
       </div>
    </div>
  );
}

export default Doctors;

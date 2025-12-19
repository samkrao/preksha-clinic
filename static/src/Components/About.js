import React from "react";
import Doctor from "../Assets/doc1.png";
import SolutionStep from "./SolutionStep";
import "../Styles/About.css";

function About() {
  return (
    <div className="about-section" id="about">
      <div className="about-image-content">
        <img src={Doctor} alt="Doctor Group" className="about-image1" />
      </div>

      <div className="about-text-content">
        <h3 className="about-title">
          <span>About Us</span>
        </h3>
        <p className="about-description">
          Welcome to Preksha Homoeopathy clinic. Doctor offer online consultations
          and prioritizing your well-being. Join us on thiss journey towards a healthier you.
        </p>

        <h4 className="about-text-title">Your Solutions</h4>

        
        <SolutionStep
          title="Make a Schedule"
          description="Choose the date and time that suits you best, and ensure your well-being with personalized care."
        />

        
      </div>
    </div>
  );
}

export default About;

import React, {Component } from "react";
import InformationCard from "./InformationCard";
import { faMortarPestle,faStaffSnake,faDna } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Info.css";
import plus from "../Assets/Plus4.png";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


function Info() {
  return (
    <div className="info-section" id="services">
      <div className="info-title-content">
        <h3 className="info-title">
          <span>What We Do</span>
        </h3>
        <p className="info-description">
          We bring healthcare to your convenience, offering a comprehensive
          range of medical services through Homoeopathy to your needs.
        </p>
      </div>

      <div className="info-cards-content">
      <SimpleSlider/> 
      </div>
    </div>
  );
}


class SimpleSlider extends Component {
  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
    this.state = {
      userName: '',
      error: false,
      render:true,
      validateCaptcha:false
    };
  }
  
    render() {
        return (
            <Carousel showThumbs={false} >
                <div ref={this.gridRef} >
                  <InformationCard
                      title="Homoeopathy treatement"
                      description=" Homoeopathy "
                      icon={faStaffSnake}
                    />
                </div>
                <div>
                  <InformationCard
                      title="Homoeopathy Medicine"
                      description=" Homoeopathy "
                      icon={faMortarPestle}
                    />
                </div>
                <div>
                  <InformationCard
                      title="Homoeopathy and Heridetary"
                      description=" Homoeopathy "
                      icon={faDna}
                    />
                </div>

            </Carousel>
        );
    }
}

export default Info;

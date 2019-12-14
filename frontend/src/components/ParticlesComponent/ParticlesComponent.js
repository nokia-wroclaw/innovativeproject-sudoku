import "./ParticlesComponent.scss";
import React from "react";
import Particles from "react-particles-js";

const ParticlesComponent = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      }}
    >
      <Particles
        params={{
          particles: {
            number: {
              // value: 80,
              value: 60,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#ffffff"
            },
            shape: {
              type: "images",
              stroke: {
                width: 0,
                color: "#000000"
              },
              polygon: {
                nb_sides: 5
              },
              images: [
                {
                  src: "/numbers/1.svg",
                  width: 100,
                  height: 170
                },
                {
                  src: "/numbers/2.svg",
                  width: 100,
                  height: 160
                },
                {
                  src: "/numbers/3.svg",
                  width: 100,
                  height: 160
                },
                {
                  src: "/numbers/4.svg",
                  width: 100,
                  height: 160
                },
                {
                  src: "/numbers/5.svg",
                  width: 100,
                  height: 160
                },
                {
                  src: "/numbers/6.svg",
                  width: 100,
                  height: 160
                },
                {
                  src: "/numbers/7.svg",
                  width: 100,
                  height: 160
                },
                {
                  src: "/numbers/8.svg",
                  width: 100,
                  height: 160
                },
                {
                  src: "/numbers/9.svg",
                  width: 100,
                  height: 160
                }
              ]
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              // value: 3,
              value: 10,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
              }
            },
            line_linked: {
              // enable: true,
              enable: false,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 4,
              direction: "none",
              random: false,
              straight: false,
              // "out_mode": "out",
              bounce: true,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse"
              },
              onclick: {
                enable: true,
                mode: "push"
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 300,
                line_linked: {
                  opacity: 1
                }
              },
              repulse: {
                distance: 150,
                duration: 0.4
              },
              push: {
                particles_nb: 2
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true
        }}
      />
    </div>
  );
};

export default ParticlesComponent;

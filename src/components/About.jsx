import '../App.css';
import React from "react";

function About() {
    return (
    <div className='App'>
      <header className='App-header'>
          <div align='left' style={{width: window.innerWidth * 0.8}}>
              <ul style={{fontSize: "18px"}}>
                  <li>
                      Developer: Keny Lin<br />
                      <br />GitHub: <a rel='noreferrer' target='_blank' href='https://github.com/Kenytw'>https://github.com/Kenytw</a>
                      <br />LinkedIn: <a rel='noreferrer' target='_blank' href='https://www.linkedin.com/in/kenylin/'>https://www.linkedin.com/in/kenylin/</a>
                      <br />&nbsp;
                  </li>
                  <li>
                      Website is host on GCP
                      <br />&nbsp;
                  </li>
                  <li>
                      Front-End is developed with ReactJS
                      (<a rel='noreferrer' target='_blank' href='https://react.dev/'>https://react.dev/</a>)
                      <br />&nbsp;
                  </li>
                  <li>
                      Front-End is developed with Three.js
                      (<a rel='noreferrer' target='_blank' href='https://threejs.org/'>https://threejs.org/</a>)
                      <br />&nbsp;
                  </li>
                  <li>
                      Server-End is developed with Python Flask
                      (<a rel='noreferrer' target='_blank' href='https://flask.palletsprojects.com/en/2.3.x/'>https://flask.palletsprojects.com/en/2.3.x//</a>)
                      <br />&nbsp;
                  </li>
                  <li>
                      Object Detection is using Ultralytics YOLOv8 model
                      (<a rel='noreferrer' target='_blank' href='https://docs.ultralytics.com/'>https://docs.ultralytics.com/</a>)
                      <br />&nbsp;
                  </li>
                  <li>
                      Pose Landmark Detection is using MediaPipe API
                      (<a rel='noreferrer' target='_blank' href='https://developers.google.com/mediapipe'>https://developers.google.com/mediapipe/</a>)
                      <br />&nbsp;
                  </li>
                  <li>
                      3D model is using Stacy-rigged
                      (<a rel='noreferrer' target='_blank' href='https://www.turbosquid.com/3d-models/3d-stacy-resolution-games-model/535459'>https://www.turbosquid.com/3d-models/3d-stacy-resolution-games-model/535459/</a>)
                      <br />&nbsp;
                  </li>
              </ul>
          </div>
      </header>
    </div>
    )
}

export default About;
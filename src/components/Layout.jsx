import '../App.css';
import React from "react";
import {Outlet} from "react-router-dom";
import Navbar from "../Navbar";
import github_logo from "../images/github-mark-white.png";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const Layout = () => {
  return (
    <div className='App'>
      <header className='Nav-header'>
        <table width='90%'>
            <tbody>
                <tr>
                    <td>
                        <BrowserView>
                            <div align='center' style={{fontSize: "30px", fontWeight: "bold"}}>
                                people skeleton detection - beta
                            </div>
                        </BrowserView>
                        <MobileView>
                            <div align='center' style={{fontSize: "22px", fontWeight: "bold"}}>
                                people skeleton detection - beta
                            </div>
                        </MobileView>
                        <div align='right' style={{fontSize: "12px"}}>
                            <a rel='noreferrer' href='https://github.com/Kenytw/flask_for_people_skeleton_detection' target='_blank'>python flask code</a>
                            &nbsp;/ <a rel='noreferrer' href='https://github.com/Kenytw/3d-model-animated-based-on-human-pose-estimation' target='_blank'>three js code</a>
                            &nbsp;/ <a rel='noreferrer' href='https://github.com/Kenytw/reactjs_demo_call_flask.git' target='_blank'>react js app code</a> <img src={github_logo} alt='GitHub' style={{width: "18px"}} />
                            <br/>&nbsp;
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align='center' style={{fontSize: "20px", fontWeight: "bold"}}>
                        <Navbar />
                        <br/><br/>&nbsp;
                    </td>
                </tr>
                <tr>
                    <td>
                        <Outlet />
                    </td>
                </tr>
            </tbody>
        </table>
      </header>
    </div>
  );
};

export default Layout;
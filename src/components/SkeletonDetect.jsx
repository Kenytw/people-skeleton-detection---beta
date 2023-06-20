import '../App.css';
import {useState, useEffect} from 'react';
import React from "react";
import logo from "../logo.svg";
import { createSearchParams, useNavigate } from "react-router-dom";

function App() {
  const [videoSrc, setSrc] = useState('');
  const [status, setStatus] = useState('please choose a video');
  const [imgSrc, setImgSrc] = useState(logo);
  const [folder_name, setFolderName] = useState('');
  const [playSpeed, setPlaySpeed] = useState(parseFloat(200).toFixed(2));
  const navigate = useNavigate();

  let json_obj;
  let result_frame = 0;
  let video_frame = 0;
  let video;
  let play_delay = 0;
  let zoomRate = 1;
  let FPS = 30;
  let streaming = false;
  let myTimeout;
  let playTimeout;
  let mouseDownX = 0;
  let mouseDownY = 0;
  let imgMoveX = 0;
  let imgMoveY = 0;
  let imgData = {};
  let imgKey = 1;
  let keyForStartUpload = 10;
  let sendingImgFlag = false;
  let imgWidth = 380;
  let processingFlag = false;
  let processingMark = 1;

  useEffect(() => {
      const onPageLoad = () => {
          video = document.getElementById('videoElement');

          video.width = 380;
          video.height =266;

          video.addEventListener('loadedmetadata', loaded);
          video.addEventListener('play', start);
          video.addEventListener('pause', stop);

          document.getElementById('file_select').onchange = function(event) {
              handleChange(event);
          };

          document.getElementById('show_again_btn').onclick = function() {
              playResult();
          };

          document.getElementById('stop_btn').onclick = function() {
              stopPlayResult();
          };

          document.getElementById('next_btn').onclick = function() {
              nextResult();
          };

          document.getElementById('previous_btn').onclick = function() {
              previousResult();
          };

          document.getElementById('first_btn').onclick = function() {
              firstResult();
          };

          document.getElementById('last_btn').onclick = function() {
              lastResult();
          };

          document.getElementById('process_btn').onclick = function() {
              processResult();
          };

          document.getElementById('plus_speed_btn').onclick = function() {
              plusPlaySpeed();
          };

          document.getElementById('minus_speed_btn').onclick = function() {
              minusPlaySpeed();
          };

          document.getElementById('zoom_in_btn').onclick = function() {
              imgZoomIn();
          };

          document.getElementById('zoom_out_btn').onclick = function() {
              imgZoomOut();
          };

          document.getElementById('clean_btn').onclick = function() {
              clearAllResult();
          };

          document.getElementById('choose_video_btn').onclick = function() {
              setStatus('please choose a video');
              showVideoArea();
              hiddenResultArea();
              clearAllResult();
          };

          document.getElementById('imgDiv').addEventListener('mousedown', imgMoveIni);
          document.getElementById('imgDiv').addEventListener('mouseup', imgMoveEnd);
          //document.getElementById('imgDiv').addEventListener('mousemove', imgMove);
      }

      if (document.readyState === 'complete') {
          onPageLoad();
      } else {
          window.addEventListener('load', onPageLoad);
          // Remove the event listener when component unmounts
          return () => window.removeEventListener('load', onPageLoad);
      }
  }, []);

  function playResult() {
      if (json_obj !== undefined) {
          if (result_frame === json_obj.files.length-1) result_frame = 0;
          hiddenVideoArea();
          document.getElementById('stop_btn').disabled = false;
          showResult();
      }
  }

  function stopPlayResult() {
      clearTimeout(playTimeout);
      document.getElementById('show_again_btn').disabled = false;
      document.getElementById('stop_btn').disabled = true;
      document.getElementById('next_btn').disabled = false;
      document.getElementById('previous_btn').disabled = false;
      document.getElementById('first_btn').disabled = false;
      document.getElementById('last_btn').disabled = false;
      document.getElementById('zoom_in_btn').disabled = false;
      document.getElementById('zoom_out_btn').disabled = false;
      document.getElementById('show_3d_btn').disabled = false;
      document.getElementById('choose_video_btn').disabled = false;
  }

  function imgMoveIni(event) {
      let img_element = document.getElementById('imgElement');

      let bounds = img_element.getBoundingClientRect();
      mouseDownX = event.pageX - bounds.left;
      mouseDownY = event.pageY - bounds.top;

      //console.log(mouseDownX, mouseDownY);
      document.onmousemove = imgMove;
      return false;
  }

  function imgMove(event) {
      return false;
  }

  function imgMoveEnd(event) {
      let img_element = document.getElementById('imgElement');
      let bounds = img_element.getBoundingClientRect();
      let x = event.pageX - bounds.left;
      let y = event.pageY - bounds.top;
      let gapX = x - mouseDownX + imgMoveX;
      let gapY = y - mouseDownY + imgMoveY;

      img_element.style.transform = 'translate(' + gapX + 'px, ' + gapY + 'px) scale(-' + zoomRate + ', ' + zoomRate + ')';

      imgMoveX = gapX;
      imgMoveY = gapY;
  }

  function imgZoomIn() {
      if (zoomRate === 0.5) {
          zoomRate = 1;
      }else{
          zoomRate = zoomRate + 1;
      }
      let img_element = document.getElementById("imgElement");
      img_element.style.transition = 'transform 0.3s';
      img_element.style.transform = 'scale(-' + zoomRate + ', ' + zoomRate + ')';
  }

  function imgZoomOut() {
      zoomRate = zoomRate - 1;
      if (zoomRate < 1) zoomRate = 0.5;
      let img_element = document.getElementById("imgElement");
      img_element.style.transition = 'transform 0.3s';
      img_element.style.transform = 'scale(-' + zoomRate + ', ' + zoomRate + ')';
  }

  function plusPlaySpeed() {
      play_delay = play_delay - 10;
      const delay = 133 + play_delay;
      setPlaySpeed(parseFloat(delay).toFixed(2));
  }

  function minusPlaySpeed() {
      play_delay = play_delay + 10;
      const delay = 133 + play_delay;
      setPlaySpeed(parseFloat(delay).toFixed(2));
  }

  function disable_all_btn() {
      document.getElementById('process_btn').disabled = true;
      document.getElementById('clean_btn').disabled = true;
      document.getElementById('file_select').disabled = true;
      document.getElementById('show_again_btn').disabled = true;
      document.getElementById('stop_btn').disabled = true;
      document.getElementById('next_btn').disabled = true;
      document.getElementById('previous_btn').disabled = true;
      document.getElementById('first_btn').disabled = true;
      document.getElementById('last_btn').disabled = true;
      document.getElementById('plus_speed_btn').disabled = true;
      document.getElementById('minus_speed_btn').disabled = true;
      document.getElementById('zoom_in_btn').disabled = true;
      document.getElementById('zoom_out_btn').disabled = true;
      document.getElementById('show_3d_btn').disabled = true;
      document.getElementById('choose_video_btn').disabled = true;
  }

  function enable_all_btn() {
      document.getElementById('process_btn').disabled = false;
      document.getElementById('clean_btn').disabled = false;
      document.getElementById('file_select').disabled = false;
      document.getElementById('show_again_btn').disabled = false;
      document.getElementById('stop_btn').disabled = false;
      document.getElementById('next_btn').disabled = false;
      document.getElementById('previous_btn').disabled = false;
      document.getElementById('first_btn').disabled = false;
      document.getElementById('last_btn').disabled = false;
      document.getElementById('plus_speed_btn').disabled = false;
      document.getElementById('minus_speed_btn').disabled = false;
      document.getElementById('zoom_in_btn').disabled = false;
      document.getElementById('zoom_out_btn').disabled = false;
      document.getElementById('show_3d_btn').disabled = false;
      document.getElementById('choose_video_btn').disabled = false;
  }

  function createFolder() {
      fetch('/api/createFolder')
          .then(response => response.text())
          .then(data => {
              setFolderName(data);
          });
  }

  function deleteFolder() {
    if (document.getElementById('folder_name').innerText.trim() !== '') {
        let url = '/api/deleteFolder?folder_name=' + document.getElementById('folder_name').innerText;
        fetch(url)
            .then(response => response.text())
            //.then(data => setStatus(data))
            .catch(error => console.log(error));
    }
  }

  function handleChange(event) {
      try {
          clearAllResult();
          const file = event.target.files[0];
          setSrc(URL.createObjectURL(file));
      }catch(error){
          console.log(error);
      }
  }

  function clearAllResult() {
      deleteFolder();
      createFolder();
      document.getElementById('process_btn').disabled = true;
      imgData = {};
      imgKey = 1;
      video_frame = 1;
      json_obj = undefined;
      setImgSrc(logo);
  }

  function loaded() {
      setStatus('video loaded');
      clearTimeout(myTimeout);
      streaming = false;
  }

  async function stop() {
      //setStatus('video stop and data uploading!');
      clearTimeout(myTimeout);
      streaming = false;

      if (imgKey < (Object.keys(imgData).length - 1) && !sendingImgFlag) {
          await sendImage();
      }
  }

  const show3d = (folder_name) => {
        navigate({
            pathname: '/Show3d',
            search: createSearchParams({
                folder_name: document.getElementById('folder_name').innerText
            }).toString()
        });
  };

  async function sendImage() {
      sendingImgFlag = true;
      for (let key in imgData) {
          if (imgKey < parseInt(key)) {
              const formData = new FormData();
              formData.append('image', imgData[key]);
              let url = '/api/sendImage?video_frame=' + key + '&folder_name=' + document.getElementById('folder_name').innerText;
              const response = await fetch(url, {
                  method: 'POST',
                  body: formData
              }).catch(error => console.log(error));

              if (response.status === 200) {
                  //const url = await response.text();
                  setStatus('uploading data ' + parseInt(key) + '/' + (Object.keys(imgData).length - 1));
              } else {
                  console.log('Error from API.');
              }

              imgKey = parseInt(key);
          }
      }

      if (imgKey < Object.keys(imgData).length-1) {
          setTimeout(sendImage, 100);
      }else{
          sendingImgFlag = false;
          if (!streaming) {
              setStatus('please click "process data"');
              imgData = {};
              imgKey = 1;
              enable_all_btn();
          }
      }
  }

  function hiddenResultArea() {
      document.getElementById('resultTD1').hidden = true;
      document.getElementById('resultTD2').hidden = true;
      document.getElementById('resultTD3').hidden = true;
  }

  function showResultArea() {
      document.getElementById('resultTD1').hidden = false;
      document.getElementById('resultTD2').hidden = false;
      document.getElementById('resultTD3').hidden = false;
  }

  function hiddenVideoArea() {
      document.getElementById('videoTD1').hidden = true;
      document.getElementById('videoTD2').hidden = true;
      document.getElementById('videoTD3').hidden = true;
  }

  function showVideoArea() {
      document.getElementById('videoTD1').hidden = false;
      document.getElementById('videoTD2').hidden = false;
      document.getElementById('videoTD3').hidden = false;
  }
  async function processResult() {
      hiddenVideoArea();
      processingFlag = true;
      showProcessingBar();
      disable_all_btn();
      let url = '/api/detect?folder_name=' + document.getElementById('folder_name').innerText;
      await fetch(url, {timeout: 8000})
          .then(response => response.json()
          .then(data => {
              processingFlag = false;
              json_obj = data;
          })).catch(error => console.log('API error for detecting'));

      if (json_obj !== undefined) {
          document.getElementById('file_select').disabled = false;
          result_frame = 0;
          setStatus('result showing');
          showResult();
      }
      showResultArea();
      enable_all_btn();
  }

  function showProcessingBar() {
      let mark = '';
      let i = 1;
      while (i <= processingMark) {
          mark = mark + '.';
          i ++;
      }
      setStatus('data processing' + mark);
      processingMark ++;
      if (processingMark === 7) processingMark =1;
      if (processingFlag) {
          setTimeout(showProcessingBar, 500);
      }else{
          setStatus('result showing');
      }
  }

  function nextResult() {
      result_frame ++;
      if (result_frame >= json_obj.files.length) result_frame = 0;
      setImgSrc(JSON.stringify(json_obj.files[result_frame].data).replaceAll('"',''));
      const img_element = document.getElementById('imgElement');
      img_element.style.transform = 'scaleX(-1)';
      img_element.width = imgWidth;

      zoomRate = 1;
      mouseDownX = 0;
      mouseDownY = 0;
      imgMoveX = 0;
      imgMoveY = 0;
  }

  function previousResult() {
      result_frame = result_frame - 1;
      if (result_frame <= 0) result_frame = json_obj.files.length-1;
      setImgSrc(JSON.stringify(json_obj.files[result_frame].data).replaceAll('"',''));
      const img_element = document.getElementById('imgElement');
      img_element.style.transform = 'scaleX(-1)';
      img_element.width = imgWidth;

      zoomRate = 1;
      mouseDownX = 0;
      mouseDownY = 0;
      imgMoveX = 0;
      imgMoveY = 0;
  }

  function firstResult() {
      result_frame = 0;
      setImgSrc(JSON.stringify(json_obj.files[result_frame].data).replaceAll('"',''));
      const img_element = document.getElementById('imgElement');
      img_element.style.transform = 'scaleX(-1)';
      img_element.width = imgWidth;

      zoomRate = 1;
      mouseDownX = 0;
      mouseDownY = 0;
      imgMoveX = 0;
      imgMoveY = 0;
  }

  function lastResult() {
      result_frame = json_obj.files.length-1;
      setImgSrc(JSON.stringify(json_obj.files[result_frame].data).replaceAll('"',''));
      const img_element = document.getElementById('imgElement');
      img_element.style.transform = 'scaleX(-1)';
      img_element.width = imgWidth;

      zoomRate = 1;
      mouseDownX = 0;
      mouseDownY = 0;
      imgMoveX = 0;
      imgMoveY = 0;
  }

  function showResult() {
      zoomRate = 1;
      mouseDownX = 0;
      mouseDownY = 0;
      imgMoveX = 0;
      imgMoveY = 0;

      if (result_frame < json_obj.files.length) {
          document.getElementById('show_again_btn').disabled = true;
          document.getElementById('stop_btn').disabled = false;
          document.getElementById('next_btn').disabled = true;
          document.getElementById('previous_btn').disabled = true;
          document.getElementById('first_btn').disabled = true;
          document.getElementById('last_btn').disabled = true;
          document.getElementById('zoom_in_btn').disabled = true;
          document.getElementById('zoom_out_btn').disabled = true;
          document.getElementById('show_3d_btn').disabled = true;
          document.getElementById('choose_video_btn').disabled = true;
          const begin = Date.now();
          setImgSrc(JSON.stringify(json_obj.files[result_frame].data).replaceAll('"',''));
          const img_element = document.getElementById('imgElement');
          img_element.style.transform = 'scaleX(-1)';
          img_element.width = imgWidth;
          result_frame ++;
          const delay = playSpeed - (Date.now() - begin) + play_delay;
          setPlaySpeed(parseFloat(delay).toFixed(2));
          playTimeout = setTimeout(showResult, delay);
      }else{
          document.getElementById('show_again_btn').disabled = false;
          document.getElementById('stop_btn').disabled = true;
          document.getElementById('next_btn').disabled = false;
          document.getElementById('previous_btn').disabled = false;
          document.getElementById('first_btn').disabled = false;
          document.getElementById('last_btn').disabled = false;
          document.getElementById('zoom_in_btn').disabled = false;
          document.getElementById('zoom_out_btn').disabled = false;
          document.getElementById('show_3d_btn').disabled = false;
          document.getElementById('choose_video_btn').disabled = false;
          result_frame = result_frame - 1;
      }
  }

  function start() {
      setStatus('video playing');
      hiddenResultArea();
      disable_all_btn();
      streaming = true;

      let canvas = document.getElementById('canvasOutput');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      setTimeout(processVideo, 0);
  }

  function processVideo () {
      try {
          const begin = Date.now();

          const uploadImageWidth = 1080;

          let canvas = document.getElementById('canvasOutput');
          const canvasWidth = video.videoWidth * uploadImageWidth / video.videoWidth;
          const canvasHeight = video.videoHeight * uploadImageWidth / video.videoWidth;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth * uploadImageWidth / video.videoWidth, video.videoHeight * uploadImageWidth / video.videoWidth)

          let type = 'image/jpeg';
          let data = canvas.toDataURL(type);
          data = data.replace('data:' + type + ';base64,', '');

          let str = "" + video_frame;
          let pad = "000000000";
          let ans = pad.substring(0, pad.length - str.length) + str;

          imgData[ans] = data;
          if (video_frame === keyForStartUpload) sendImage();
          video_frame ++;

          let delay = 8000 / FPS - (Date.now() - begin);
          if (delay < 0) delay = 100;
          //console.log(delay);
          myTimeout = setTimeout(processVideo, delay);
      } catch (error) {
          console.log(error);
      }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
              <table className='main-table-browser'>
                  <tbody>
                      <tr>
                          <td id='videoTD1' colSpan='2'>
                              <canvas id='canvasOutput' hidden></canvas>
                              <video id='videoElement' src={videoSrc} controls autoPlay>
                              Sorry, your browser doesn't support embedded videos.
                              </video>
                          </td>
                      </tr>
                      <tr>
                          <td id='videoTD2' colSpan='2'>
                              video: <input type='file' id='file_select' />
                          </td>
                      </tr>
                      <tr>
                          <td id='videoTD3' colSpan='2'>
                              <button id='process_btn' disabled>process data</button>
                              <button id='clean_btn' disabled>clean all result</button>
                          </td>
                      </tr>
                      <tr>
                          <td id='resultTD1' hidden colSpan='2'>
                              <div className='img-container' style={{width: "100%"}} id='imgDiv'>
                                <img id='imgElement' src={imgSrc} width={380} alt='result' />
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td  id='resultTD2' hidden colSpan='2'>
                              play speed: {playSpeed} FPS
                          </td>
                      </tr>
                      <tr>
                          <td id='resultTD3' hidden colSpan='2'>
                              <button id='show_again_btn'>play</button>
                              <button id='stop_btn'>stop</button>&nbsp;
                              <button id='first_btn'>first</button>
                              <button id='previous_btn'>previous</button>
                              <button id='next_btn'>next</button>
                              <button id='last_btn'>last</button><br/>
                              <button id='plus_speed_btn'>+ play speed</button>
                              <button id='minus_speed_btn'>- play speed</button>&nbsp;
                              <button id='zoom_in_btn'>zoom in</button>
                              <button id='zoom_out_btn'>zoom out</button><br/>
                              <button id='show_3d_btn' onClick={show3d}>show 3d (result will only show 1st detected person)</button>
                              <br /><button id='choose_video_btn'>choose another video</button>
                          </td>
                      </tr>
                      <tr>
                          <td>
                              <div id='statusDiv' style={{fontSize: "16px"}}>
                                  status: {status}
                                  <div id='folder_name' hidden>{folder_name}</div>
                              </div>
                          </td>
                      </tr>
                  </tbody>
              </table>
        </div>
      </header>
    </div>
  );
}

export default App;

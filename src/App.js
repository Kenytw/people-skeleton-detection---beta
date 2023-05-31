import './App.css';
import {useState, useEffect} from 'react';
import React from "react";
import logo from "./logo.svg";

function App() {
  const [videoSrc, setSrc] = useState('');
  const [status, setStatus] = useState('none');
  const [imgSrc, setImgSrc] = useState(logo);
  const [folder_name, setFolderName] = useState('');
  const [playSpeed, setPlaySpeed] = useState(parseFloat(200).toFixed(2));

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
  let keyForStartUpload = 20;
  let sendingImgFlag = false;

  useEffect(() => {
      const onPageLoad = () => {
          document.addEventListener('fullscreenchange', onFullscreenChange);

          video = document.getElementById('videoElement');

          video.width = 500;
          video.height =350;

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
              showVideoArea();
              hiddenResultArea();
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
          hiddenVideoArea();
          showResult();
      }
  }

  function stopPlayResult() {
      clearTimeout(playTimeout);
      document.getElementById('show_again_btn').disabled = false;
      document.getElementById('next_btn').disabled = false;
      document.getElementById('previous_btn').disabled = false;
      document.getElementById('zoom_in_btn').disabled = false;
      document.getElementById('zoom_out_btn').disabled = false;
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
      document.getElementById('plus_speed_btn').disabled = true;
      document.getElementById('minus_speed_btn').disabled = true;
      document.getElementById('zoom_in_btn').disabled = true;
      document.getElementById('zoom_out_btn').disabled = true;
  }

  function enable_all_btn() {
      document.getElementById('process_btn').disabled = false;
      document.getElementById('clean_btn').disabled = false;
      document.getElementById('file_select').disabled = false;
      document.getElementById('show_again_btn').disabled = false;
      document.getElementById('stop_btn').disabled = false;
      document.getElementById('next_btn').disabled = false;
      document.getElementById('previous_btn').disabled = false;
      document.getElementById('plus_speed_btn').disabled = false;
      document.getElementById('minus_speed_btn').disabled = false;
      document.getElementById('zoom_in_btn').disabled = false;
      document.getElementById('zoom_out_btn').disabled = false;
  }

  function createFolder() {
      fetch('/createFolder')
          .then(response => response.text())
          .then(data => {
              setFolderName(data);
          });
  }

  function deleteFolder() {
    if (document.getElementById('folder_name').innerText.trim() !== '') {
        let url = '/deleteFolder?folder_name=' + document.getElementById('folder_name').innerText;
        fetch(url)
            .then(response => response.text())
            //.then(data => setStatus(data))
            .catch(error => console.log(error));
    }
  }

  const useUnload = fn => {
    const cb = React.useRef(fn);

    React.useEffect(() => {
      const onUnload = cb.current;
      window.addEventListener('beforeunload', onUnload);
      return () => {
        window.removeEventListener('beforeunload', onUnload);
      };
    }, [cb]);
  };

  useUnload(e => {
    e.preventDefault();
    deleteFolder();
  });

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

  async function sendImage() {
      sendingImgFlag = true;
      for (let key in imgData) {
          if (imgKey < parseInt(key)) {
              const formData = new FormData();
              formData.append('image', imgData[key]);
              let url = '/sendImage?video_frame=' + key + '&folder_name=' + document.getElementById('folder_name').innerText;
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
              setStatus('total uploaded');
              imgData = {};
              imgKey = 1;
              enable_all_btn();
          }
      }
  }

  function onFullscreenChange() {

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
      setStatus('result processing');
      disable_all_btn();
      let url = '/detect?folder_name=' + document.getElementById('folder_name').innerText;
      await fetch(url)
          .then(response => response.json()
          .then(data => {
              setStatus('result done');
              json_obj = data;
          })).catch(error => console.log(error.messages));

      if (json_obj !== undefined) {
          document.getElementById('file_select').disabled = false;
          result_frame = 0;
          showResult();
      }
      showResultArea();
      enable_all_btn();
  }

  function nextResult() {
      result_frame ++;
      if (result_frame >= json_obj.files.length) result_frame = 0;
      setImgSrc(JSON.stringify(json_obj.files[result_frame].data).replaceAll('"',''));
      const img_element = document.getElementById('imgElement');
      img_element.style.transform = 'scaleX(-1)';
      img_element.width = 500;

      zoomRate = 1;
      mouseDownX = 0;
      mouseDownY = 0;
      imgMoveX = 0;
      imgMoveY = 0;
  }

  function previousResult() {
      result_frame = result_frame - 1;
      if (result_frame <= 0) result_frame = json_obj.files.length-2;
      setImgSrc(JSON.stringify(json_obj.files[result_frame].data).replaceAll('"',''));
      const img_element = document.getElementById('imgElement');
      img_element.style.transform = 'scaleX(-1)';
      img_element.width = 500;

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
          document.getElementById('next_btn').disabled = true;
          document.getElementById('previous_btn').disabled = true;
          document.getElementById('zoom_in_btn').disabled = true;
          document.getElementById('zoom_out_btn').disabled = true;
          const begin = Date.now();
          setImgSrc(JSON.stringify(json_obj.files[result_frame].data).replaceAll('"',''));
          const img_element = document.getElementById('imgElement');
          img_element.style.transform = 'scaleX(-1)';
          img_element.width = 500;
          result_frame ++;
          const delay = playSpeed - (Date.now() - begin) + play_delay;
          setPlaySpeed(parseFloat(delay).toFixed(2));
          playTimeout = setTimeout(showResult, delay);
      }else{
          document.getElementById('show_again_btn').disabled = false;
          document.getElementById('next_btn').disabled = false;
          document.getElementById('previous_btn').disabled = false;
          document.getElementById('zoom_in_btn').disabled = false;
          document.getElementById('zoom_out_btn').disabled = false;
          result_frame = 0;
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

          let canvas = document.getElementById('canvasOutput');
          canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

          let type = 'image/png';
          let data = document.getElementById('canvasOutput').toDataURL(type);
          data = data.replace('data:' + type + ';base64,', '');

          let str = "" + video_frame;
          let pad = "000000000";
          let ans = pad.substring(0, pad.length - str.length) + str;

          imgData[ans] = data;
          if (video_frame === keyForStartUpload) sendImage();
          video_frame ++;

          let delay = 1000 / FPS - (Date.now() - begin);
          if (delay < 0) delay = 100;
          myTimeout = setTimeout(processVideo, delay);
      } catch (error) {
          console.log(error);
      }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
          <table style={{width: 500}}>
              <tbody>
                  <tr>
                      <td width='100%' id='videoTD1'>
                          <canvas id='canvasOutput' hidden></canvas>
                          <video id='videoElement' src={videoSrc} controls autoPlay>
                          Sorry, your browser doesn't support embedded videos.
                          </video>
                      </td>
                  </tr>
                  <tr>
                      <td id='videoTD2'>
                          video: <input type='file' id='file_select' />
                      </td>
                  </tr>
                  <tr>
                      <td id='videoTD3'>
                          <button id='process_btn'>process data</button>
                          <button id='clean_btn'>clean all result</button>
                      </td>
                  </tr>
                  <tr>
                      <td id='resultTD1' hidden>
                          <div className='img-container' id='imgDiv' width='100%'>
                            <img id='imgElement' src={imgSrc} alt='result' width='400px'/>
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td  id='resultTD2' hidden>
                          play speed: {playSpeed} FPS
                      </td>
                  </tr>
                  <tr>
                      <td id='resultTD3' hidden>
                          <button id='show_again_btn'>play</button>
                          <button id='stop_btn'>stop</button>
                          <button id='previous_btn'>previous</button>
                          <button id='next_btn'>next</button><br/>
                          <button id='plus_speed_btn'>+ play speed</button>
                          <button id='minus_speed_btn'>- play speed</button>
                          <button id='zoom_in_btn'>zoom in</button>
                          <button id='zoom_out_btn'>zoom out</button><br/>
                          <button id='choose_video_btn'>choose video again</button>
                      </td>
                  </tr>
              </tbody>
          </table>
        </div>
          <div>
            <br/>status: {status}
            <div id='folder_name' hidden>{folder_name}</div>
          </div>
      </header>
    </div>
  );
}

export default App;

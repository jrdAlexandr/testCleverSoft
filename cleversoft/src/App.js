import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Hls from 'hls.js';

function App() {
  const [hlsUrl, setHlsUrl] = useState(
    'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
  );
  const [videoSrc, setVideoSrc] = useState('');
  const [isBadUrl, setIsBedUrl] = useState(false);
  const videoEl = useRef();

  useEffect(() => {
    if (videoEl.current && videoSrc) {
      if (Hls.isSupported()) {
        var hls = new Hls();
        // bind them together
        hls.attachMedia(videoEl.current);
        hls.on(Hls.Events.MEDIA_ATTACHED, function() {
          hls.loadSource(videoSrc);
          hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {});
        });
        hls.on(Hls.Events.ERROR, function(event, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setIsBedUrl(true);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setIsBedUrl(true);
                hls.recoverMediaError();
                break;
              default:
                setIsBedUrl(true);
                hls.destroy();
                break;
            }
          }
        });
      }
    }
  }, [videoSrc]);

  return (
    <div className='App'>
      <div>
        <input
          type='text'
          value={hlsUrl}
          onChange={(e) => setHlsUrl(e.target.value)}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              setVideoSrc(hlsUrl);
              setIsBedUrl(false);
            }
          }}
        />
        <button
          onClick={() => {
            setVideoSrc(hlsUrl);
            setIsBedUrl(false);
          }}
        >
          Запустить
        </button>
      </div>
      {isBadUrl ? <p>Плохая ссылка</p> : <video ref={videoEl} controls />}
    </div>
  );
}

export default App;

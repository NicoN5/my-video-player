'use client'
import { useRef, useState } from 'react'

function App() {
  const [url, setUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
  };

  setInterval(() => {
    setCurrentTime(Math.floor((videoRef.current?.currentTime || -1) * 10) / 10)
  }, 10)

  return (
    <div
      className="min-h-screen flex flex-col items-center p-8 gap-8"
    >
      <input
        type="file"
        accept="video/mp4"
        onChange={onChange}
        className="bg-white text-black"
      />
      {url && (
        <div
          className="max-w-3/4"
          style={{
            width: 700
          }}
        >
          <video
            src={url}
            className="aspect-video"
            width="100%"
            height="inherit"
            controls
            ref={videoRef}
          />

          <p
            className="text-center text-3xl mt-4"
          >
            {currentTime.toFixed(1)}s
          </p>
        </div>
      )}
    </div>
  );
}

export default App

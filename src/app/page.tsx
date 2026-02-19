"use client";
import { Subtitle } from "@/types/Subtitle";
import { generateSubtitles } from "@/utils/generateSubtitles";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

function App() {
  const [url, setUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec] = useState(0);
  const [subtitleInput, setSubtitleInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const subtitleInputRef = useRef<HTMLInputElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const idRef = useRef(0);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
  };

  setInterval(() => {
    setCurrentTime(Math.floor((videoRef.current?.currentTime || 0) * 10) / 10);
  }, 10);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (!videoRef.current || (e.target as HTMLElement).tagName === "INPUT")
        return;
      let isTriggered = false;
      switch (e.key) {
        case " ":
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
          isTriggered = true;
          break;

        case "ArrowLeft":
          videoRef.current.currentTime -= 0.1;
          isTriggered = true;
          break;

        case "ArrowRight":
          videoRef.current.currentTime += 0.1;
          isTriggered = true;
          break;
      }

      if (isTriggered) {
        console.log("triggered");
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", onKeydown);

    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  }, []);

  useEffect(() => {
    setIsCopied(false);
  }, [subtitles]);

  return (
    <div className="min-h-screen flex flex-col items-center p-8 gap-8">
      <input
        type="file"
        accept="video/mp4"
        onChange={onChange}
        className="bg-white text-black"
        tabIndex={-1}
      />

      {url && (
        <div
          className="max-w-3/4 space-y-6"
          style={{
            width: 700,
          }}
        >
          <div className="flex justify-around items-center">
            <p className="text-center text-5xl border-2 border-white w-fit px-3 py-1 rounded-xl">
              {currentTime.toFixed(1)}s
            </p>

            <select
              onChange={(e) => {
                if (!videoRef.current) return;
                videoRef.current.playbackRate = Number(e.target.value);
              }}
              defaultValue={"1"}
              className="border-2 border-white p-2 rounded-lg h-fit"
            >
              <option value={"0.1"}>0.1倍速</option>

              <option value={"0.25"}>0.25倍速</option>

              <option value={"0.5"}>0.5倍速</option>

              <option value={"0.75"}>0.75倍速</option>

              <option value={"1"}>1倍速</option>

              <option value={"1.5"}>1.5倍速</option>
            </select>
          </div>

          <video
            src={url}
            className="aspect-video"
            width="100%"
            height="inherit"
            controls
            ref={videoRef}
          />

          <div className="flex gap-1">
            <input
              className="border-2 border-white text-2xl p-2 grow"
              placeholder="開始秒数"
              value={startSec}
              onChange={(e) => setStartSec(Number(e.target.value))}
            />

            <button
              className="p-2 bg-blue-400 text-white text-xl rounded-lg"
              onClick={() => {
                if (!videoRef.current) return;
                setStartSec(Math.floor(videoRef.current.currentTime * 10) / 10);
              }}
            >
              現在位置
            </button>
          </div>

          <div className="flex gap-1">
            <input
              className="border-2 border-white text-2xl p-2 grow"
              placeholder="終了秒数"
              value={endSec}
              onChange={(e) => setEndSec(Number(e.target.value))}
            />

            <button
              className="p-2 bg-blue-400 text-white text-xl rounded-lg"
              onClick={() => {
                if (!videoRef.current) return;
                setEndSec(Math.floor(videoRef.current.currentTime * 10) / 10);
              }}
            >
              現在位置
            </button>
          </div>

          <input
            className="border-2 border-white w-full text-2xl p-2"
            placeholder="字幕を入力..."
            type="text"
            ref={subtitleInputRef}
            value={subtitleInput}
            onChange={(e) => setSubtitleInput(e.target.value)}
          />

          <button
            className="flex bg-blue-400 rounded-xl mx-auto items-center text-xl w-full justify-center"
            onClick={() => {
              if (!subtitleInputRef.current) return;
              const newSubtitle: Subtitle = {
                id: idRef.current,
                startSeconds: startSec,
                endSeconds: endSec,
                text: subtitleInput,
              };
              idRef.current++;
              setSubtitles([...subtitles, newSubtitle]);
            }}
          >
            <Plus className="w-10 h-10" />
            追加
          </button>

          <div className="flex gap-2 w-full">
            <button
              className="border border-white p-2 ml-auto"
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(generateSubtitles(subtitles));
              }}
            >
              {isCopied ? (
                <Check className="w-6 h-6" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>

          <pre>
            <code>{generateSubtitles(subtitles)}</code>
          </pre>

          {subtitles.map((s) => (
            <div
              className="flex gap-4 p-4 bg-white text-black rounded-2xl"
              key={s.id}
            >
              <p className="text-gray-500">
                {s.startSeconds}s 〜 {s.endSeconds}s
              </p>

              <p>{s.text}</p>

              <button
                onClick={() =>
                  setSubtitles((prev) => prev.filter((s2) => s2.id !== s.id))
                }
                className="ml-auto"
              >
                <Trash2 className="w-6 h-6 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { Player } from "@remotion/player";
import { LyricsVideo } from "./LyricsVideo";
import "./styles.css";

interface LyricLine {
  text: string;
  startTime: number;
  endTime: number;
}

interface CustomizationOptions {
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  animationStyle: string;
  highlightColor: string;
}

const App: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [audioSrc, setAudioSrc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [durationInFrames, setDurationInFrames] = useState(300);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    fontSize: 60,
    fontColor: "#FFFFFF",
    backgroundColor: "#000000",
    animationStyle: "fade",
    highlightColor: "#FFD700",
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setProcessingProgress(0);

    try {
      // Upload file to server with progress
      const formData = new FormData();
      formData.append("video", file);

      const uploadResponse = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const uploadData = await uploadResponse.json();
      clearInterval(uploadInterval);
      setUploadProgress(100);

      // Process the video
      const processResponse = await fetch("http://localhost:3001/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: uploadData.filename }),
      });

      // Simulate processing progress
      const processInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(processInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 500);

      const processData = await processResponse.json();
      clearInterval(processInterval);
      setProcessingProgress(100);

      if (processData.lyrics) {
        setLyrics(processData.lyrics);
        setAudioSrc(`http://localhost:3001${processData.audioPath}`);
        setVideoSrc(URL.createObjectURL(file));
        
        // Calculate duration in frames (assuming 30 fps)
        const maxEndTime = Math.max(...processData.lyrics.map((l: LyricLine) => l.endTime));
        setDurationInFrames(Math.ceil(maxEndTime * 30));
      }
    } catch (error) {
      console.error("Error processing video:", error);
      alert("Error processing video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Remotion Lyrics Generator</h1>
      </div>

      <div className="upload-area">
        <input
          type="file"
          id="video-upload"
          className="upload-input"
          accept="video/*"
          onChange={handleFileUpload}
          disabled={isProcessing}
        />
        <label htmlFor="video-upload" className="upload-label">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <div className="upload-text">
            {isProcessing ? "Processing video..." : "Click to upload a video or drag and drop"}
          </div>
        </label>
        {isProcessing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <div>Processing your video...</div>
          </div>
        )}
      </div>

      {videoSrc && (
        <div className="preview-section">
          <h2>Preview</h2>
          <div className="player-container">
            <Player
              component={LyricsVideo}
              durationInFrames={durationInFrames}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={30}
              inputProps={{ lyrics, audioSrc }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="lyrics-timeline">
            <h3>Lyrics Timeline</h3>
            {lyrics.map((lyric, index) => (
              <div key={index} className="lyric-item">
                <span className="lyric-time">{lyric.startTime.toFixed(2)}s - {lyric.endTime.toFixed(2)}s:</span> {lyric.text}
              </div>
            ))}
          </div>

          <div className="customization-panel">
            <h3>Customization Options</h3>
            <div className="form-group">
              <label htmlFor="fontSize">Font Size (px):</label>
              <input
                type="range"
                id="fontSize"
                min="30"
                max="100"
                value={customization.fontSize}
                onChange={(e) => setCustomization({...customization, fontSize: Number(e.target.value)})}
              />
              <span>{customization.fontSize}px</span>
            </div>

            <div className="form-group">
              <label htmlFor="fontColor">Font Color:</label>
              <div className="color-picker">
                <input
                  type="color"
                  id="fontColor"
                  value={customization.fontColor}
                  onChange={(e) => setCustomization({...customization, fontColor: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="backgroundColor">Background Color:</label>
              <div className="color-picker">
                <input
                  type="color"
                  id="backgroundColor"
                  value={customization.backgroundColor}
                  onChange={(e) => setCustomization({...customization, backgroundColor: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="animationStyle">Animation Style:</label>
              <select
                id="animationStyle"
                value={customization.animationStyle}
                onChange={(e) => setCustomization({...customization, animationStyle: e.target.value})}
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="highlightColor">Highlight Color:</label>
              <div className="color-picker">
                <input
                  type="color"
                  id="highlightColor"
                  value={customization.highlightColor}
                  onChange={(e) => setCustomization({...customization, highlightColor: e.target.value})}
                />
              </div>
            </div>
          </div>

          {exportProgress > 0 && exportProgress < 100 && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <div>Exporting video: {exportProgress}%</div>
            </div>
          )}

          <button
            className="export-button"
            onClick={async () => {
              if (!videoSrc || lyrics.length === 0) return;

              setExportProgress(0);

              try {
                const response = await fetch("http://localhost:3001/api/export", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    filename: videoSrc.split("/").pop()?.split(".")[0] || "output",
                    lyrics: lyrics,
                    customization: customization,
                  }),
                });

                // Simulate export progress
                const exportInterval = setInterval(() => {
                  setExportProgress((prev) => {
                    if (prev >= 95) {
                      clearInterval(exportInterval);
                      return 95;
                    }
                    return prev + 5;
                  });
                }, 400);

                const data = await response.json();
                clearInterval(exportInterval);
                setExportProgress(100);

                if (data.downloadUrl) {
                  // Create a download link
                  const link = document.createElement("a");
                  link.href = `http://localhost:3001${data.downloadUrl}`;
                  link.download = data.filename;
                  link.click();
                  
                  // Reset progress after download
                  setTimeout(() => setExportProgress(0), 2000);
                }
              } catch (error) {
                console.error("Export error:", error);
                alert("Error exporting video. Please try again.");
                setExportProgress(0);
              }
            }}
            disabled={!videoSrc || lyrics.length === 0 || isProcessing}
          >
            Export Video
          </button>

          {/* Progress indicators */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <div style={{ flex: 1, backgroundColor: "#f0f0f0", borderRadius: "4px", height: "10px" }}>
              <div style={{ width: `${uploadProgress}%`, backgroundColor: "#3498db", height: "100%", borderRadius: "4px", transition: "width 0.3s ease" }}></div>
            </div>
            <div style={{ flex: 1, backgroundColor: "#f0f0f0", borderRadius: "4px", height: "10px" }}>
              <div style={{ width: `${processingProgress}%`, backgroundColor: "#2ecc71", height: "100%", borderRadius: "4px", transition: "width 0.3s ease" }}></div>
            </div>
            <div style={{ flex: 1, backgroundColor: "#f0f0f0", borderRadius: "4px", height: "10px" }}>
              <div style={{ width: `${exportProgress}%`, backgroundColor: "#e74c3c", height: "100%", borderRadius: "4px", transition: "width 0.3s ease" }}></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", fontSize: "0.9em", color: "#7f8c8d" }}>
            <div style={{ flex: 1 }}>Upload</div>
            <div style={{ flex: 1 }}>Processing</div>
            <div style={{ flex: 1 }}>Export</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
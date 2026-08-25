import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.static("public"));
app.use("/audio", express.static("audio"));

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Create audio directory if it doesn't exist
if (!fs.existsSync("audio")) {
  fs.mkdirSync("audio");
}

// Create outputs directory if it doesn't exist
if (!fs.existsSync("outputs")) {
  fs.mkdirSync("outputs");
}

app.post("/api/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    originalname: req.file.originalname,
  });
});

app.post("/api/process", async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  try {
    const videoPath = path.join("uploads", filename);
    const audioPath = path.join("audio", `${filename}.mp3`);

    // Extract audio from video
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .audioCodec("libmp3lame")
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // TODO: Implement speech recognition
    // For now, return dummy lyrics data
    const dummyLyrics = [
      { text: "This is a sample lyric line", startTime: 1.5, endTime: 3.2 },
      { text: "Generated from the audio", startTime: 3.5, endTime: 5.0 },
      { text: "Using speech recognition", startTime: 5.5, endTime: 7.8 },
      { text: "The quick brown fox", startTime: 8.0, endTime: 10.5 },
      { text: "Jumps over the lazy dog", startTime: 11.0, endTime: 13.5 },
    ];

    res.json({
      message: "Processing completed",
      filename,
      status: "completed",
      audioPath: `/audio/${filename}.mp3`,
      lyrics: dummyLyrics,
    });
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Processing failed", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/export", async (req, res) => {
  const { filename, lyrics } = req.body;

  if (!filename || !lyrics) {
    return res.status(400).json({ error: "Filename and lyrics are required" });
  }

  try {
    const audioPath = path.join("audio", `${filename}.mp3`);
    const outputPath = path.join("outputs", `${filename}_lyrics.mp4`);

    // In a real implementation, we would call the Remotion renderer here
    // For now, we'll simulate the export process
    console.log("Starting export process...");
    console.log("Lyrics data:", lyrics);
    console.log("Audio path:", audioPath);
    console.log("Output path:", outputPath);

    // Simulate rendering process
    await new Promise(resolve => setTimeout(resolve, 3000));

    res.json({
      message: "Export completed",
      filename: `${filename}_lyrics.mp4`,
      status: "completed",
      downloadUrl: `/outputs/${filename}_lyrics.mp4`,
    });
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Export failed", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
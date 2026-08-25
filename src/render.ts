import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import { LyricsVideo } from "./LyricsVideo";

interface RenderOptions {
  lyrics: Array<{
    text: string;
    startTime: number;
    endTime: number;
  }>;
  audioSrc: string;
  outputPath: string;
  compositionId: string;
}

export const renderVideo = async (options: RenderOptions): Promise<string> => {
  const { lyrics, audioSrc, outputPath, compositionId } = options;

  try {
    console.log("Starting video rendering...");
    console.log("Lyrics:", lyrics);
    console.log("Audio source:", audioSrc);
    console.log("Output path:", outputPath);

    const outputFile = path.join(outputPath, `${compositionId}.mp4`);

    await renderMedia({
      composition: new selectComposition({
        id: compositionId,
        component: LyricsVideo,
        inputProps: { lyrics, audioSrc },
      }),
      outputLocation: outputFile,
      codec: "h264",
      imageFormat: "jpeg",
      pixelFormat: "yuv420p",
      crf: 23,
      threads: 4,
      onStart: () => {
        console.log("Render started");
      },
      onProgress: (progress) => {
        console.log(`Render progress: ${(progress * 100).toFixed(2)}%`);
      },
      onError: (error) => {
        console.error("Render error:", error);
      },
      onDone: () => {
        console.log("Render completed");
      },
    });

    console.log(`Video rendered successfully to ${outputFile}`);
    return outputFile;
  } catch (error) {
    console.error("Error during rendering:", error);
    throw error;
  }
};
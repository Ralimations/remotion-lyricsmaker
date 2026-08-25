import { Composition } from "remotion";
import { LyricsVideo } from "./LyricsVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LyricsVideo"
        component={LyricsVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
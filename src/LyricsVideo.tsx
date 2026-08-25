import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont();

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

interface LyricsVideoProps {
  lyrics: LyricLine[];
  audioSrc: string;
  customization?: CustomizationOptions;
}

export const LyricsVideo: React.FC<LyricsVideoProps> = ({ lyrics, audioSrc, customization }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const currentTime = frame / fps;

  // Find which lyric should be displayed based on current time
  const currentLyric = lyrics.find(
    (lyric) => currentTime >= lyric.startTime && currentTime <= lyric.endTime
  );

  const opacity = interpolate(
    frame,
    [0, 30],
    [0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Apply customization options with defaults
  const fontSize = customization?.fontSize || 60;
  const fontColor = customization?.fontColor || "white";
  const backgroundColor = customization?.backgroundColor || "black";
  const animationStyle = customization?.animationStyle || "fade";
  const highlightColor = customization?.highlightColor || "#FFD700";

  // Calculate animations based on style
  let scale = 1;
  let positionY = 0;
  let highlightOpacity = 0;

  if (animationStyle === "fade") {
    // Simple fade animation
    scale = interpolate(
      frame % 60,
      [0, 30, 60],
      [1, 1.05, 1],
      {
        easing: Easing.inOut(Easing.ease),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
  } else if (animationStyle === "slide") {
    // Slide up animation
    positionY = interpolate(
      frame % 60,
      [0, 30, 60],
      [50, 0, -50],
      {
        easing: Easing.inOut(Easing.ease),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
  } else if (animationStyle === "zoom") {
    // Zoom animation
    scale = interpolate(
      frame % 60,
      [0, 30, 60],
      [1.2, 1, 1.2],
      {
        easing: Easing.inOut(Easing.ease),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
  } else if (animationStyle === "bounce") {
    // Bounce animation
    scale = interpolate(
      frame % 30,
      [0, 15, 30],
      [1, 1.2, 1],
      {
        easing: Easing.inOut(Easing.ease),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
  }

  // Highlight effect for current lyric
  if (currentLyric) {
    const timeInLyric = currentTime - currentLyric.startTime;
    const lyricDuration = currentLyric.endTime - currentLyric.startTime;
    const progress = timeInLyric / lyricDuration;

    highlightOpacity = interpolate(
      progress,
      [0, 0.5, 1],
      [0, 0.8, 0],
      {
        easing: Easing.inOut(Easing.ease),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
  }

  return (
    <div
      style={
        {
          flex: 1,
          backgroundColor: backgroundColor,
          justifyContent: "center",
          alignItems: "center",
          fontFamily,
        }
      }
    >
      <audio src={audioSrc} />
      <div
        style={
          {
            fontSize: fontSize,
            color: fontColor,
            textAlign: "center",
            opacity,
            transform: `scale(${scale}) translateY(${positionY}px)`,
            transition: "transform 0.3s ease, opacity 0.3s ease",
            textShadow: `0 0 10px rgba(255, 255, 255, 0.5)`,
          }
        }
      >
        {currentLyric ? currentLyric.text : ""}
      </div>

      {/* Highlight effect */}
      {currentLyric && (
        <div
          style={
            {
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: "4px",
              backgroundColor: highlightColor,
              opacity: highlightOpacity,
              borderRadius: "2px",
            }
          }
        />
      )}

      {/* Show upcoming lyrics with lower opacity */}
      {lyrics
        .filter((lyric) => currentTime < lyric.startTime)
        .slice(0, 2)
        .map((lyric, index) => (
          <div
            key={index}
            style={
              {
                fontSize: fontSize * 0.7,
                color: `${fontColor}80`, // Add alpha channel
                textAlign: "center",
                marginTop: 80 + index * 60,
                opacity: 0.7,
                fontWeight: "300",
              }
            }
          >
            {lyric.text}
          </div>
        ))}
    </div>
  );
};
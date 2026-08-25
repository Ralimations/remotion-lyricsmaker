# Remotion Lyrics Generator

A web application that uses Remotion to import videos, automatically generate synchronized lyrics, and export videos with animated lyric visualizations.

## Features

- **Video Upload**: Upload video files (MP4, MOV, WebM)
- **Audio Extraction**: Extract audio track from video
- **Speech Recognition**: Transcribe spoken words to text (simulated)
- **Lyrics Generation**: Convert transcription to formatted lyrics
- **Sync Detection**: Align lyrics with audio timing
- **Visualization**: Create animated lyrics that appear in sync
- **Video Export**: Render final video with lyrics overlay
- **Customization**: Adjust font, colors, animations, and more
- **Progress Tracking**: Real-time progress indicators

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/remotion-lyricsmaker.git
   cd remotion-lyricsmaker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install FFmpeg (required for audio processing):
   - On macOS: `brew install ffmpeg`
   - On Windows: Download from https://ffmpeg.org/
   - On Linux: `sudo apt-get install ffmpeg`

## Development

### Start the development server:
```bash
npm run dev
```

### Start the API server:
```bash
npm run server
```

### Run both servers concurrently:
```bash
npm run start
```

## Usage

1. Open the application in your browser at `http://localhost:3000`
2. Upload a video file using the drag-and-drop interface
3. Wait for the video to be processed (audio extraction and lyrics generation)
4. Preview the synchronized lyrics
5. Customize the appearance using the options panel
6. Export the final video with lyrics overlay

## Project Structure

- `src/` - Main application source code
  - `index.tsx` - Remotion composition entry point
  - `LyricsVideo.tsx` - Main video component with lyrics visualization
  - `App.tsx` - React application with UI components
  - `styles.css` - CSS styles for the application
  - `render.ts` - Video rendering functions

- `server/` - Backend API server
  - `index.ts` - Express server with API endpoints

- `public/` - Static assets
  - `index.html` - HTML entry point

- `uploads/` - Uploaded video files (created automatically)
- `audio/` - Extracted audio files (created automatically)
- `outputs/` - Rendered output videos (created automatically)

## API Endpoints

- `POST /api/upload` - Upload a video file
- `POST /api/process` - Process video and extract lyrics
- `POST /api/export` - Export video with lyrics

## Customization Options

- **Font Size**: Adjust the size of the lyrics text (30-100px)
- **Font Color**: Choose the color for the lyrics text
- **Background Color**: Set the background color of the video
- **Animation Style**: Select from different animation effects (fade, slide, zoom, bounce)
- **Highlight Color**: Choose the color for the lyric highlight indicator

## Future Enhancements

- Real speech recognition using Whisper or similar STT model
- Multi-language support
- Style templates for different music genres
- Auto-translation of lyrics
- Collaborative editing features
- Mobile app version
- Real-time preview during upload

## Dependencies

- React 18+
- Remotion 4.x
- TypeScript
- Express
- FFmpeg
- fluent-ffmpeg

## License

ISC
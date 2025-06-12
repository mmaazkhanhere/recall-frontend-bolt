import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';

interface VideoPlayerProps {
  src: string;
  title: string;
  onTimeUpdate?: (time: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, onTimeUpdate }) => {
  const { videoRef, state, controls, handlers } = useVideoPlayer();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * state.duration;
    controls.seekTo(newTime);
  };

  React.useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(state.currentTime);
    }
  }, [state.currentTime, onTimeUpdate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-xl bg-black shadow-2xl"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handlers.onTimeUpdate}
        className="h-full w-full"
        poster="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
      >
        <track kind="captions" src="" srcLang="en" label="English" />
      </video>

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div
              className="group relative h-1 cursor-pointer rounded-full bg-white/30"
              onClick={handleSeekClick}
            >
              <div
                className="h-full rounded-full bg-primary transition-all group-hover:h-1.5"
                style={{ width: `${(state.currentTime / state.duration) * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: `${(state.currentTime / state.duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={state.isPlaying ? controls.pause : controls.play}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              >
                {state.isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5" />
                )}
              </motion.button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={controls.toggleMute}
                  className="text-white hover:text-primary"
                >
                  {state.isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </motion.button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.volume}
                  onChange={(e) => controls.setVolume(parseFloat(e.target.value))}
                  className="w-20 accent-primary"
                />
              </div>

              {/* Time */}
              <div className="text-sm text-white">
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Playback Speed */}
              <select
                value={state.playbackRate}
                onChange={(e) => controls.setPlaybackRate(parseFloat(e.target.value))}
                className="rounded bg-white/20 px-2 py-1 text-sm text-white backdrop-blur-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-primary"
              >
                <Settings className="h-5 w-5" />
              </motion.button>

              {/* Fullscreen */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={controls.toggleFullscreen}
                className="text-white hover:text-primary"
              >
                <Maximize className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      <div className="absolute left-4 top-4">
        <h3 className="text-lg font-semibold text-white drop-shadow-lg">{title}</h3>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
import { useState, useRef, useCallback } from 'react';

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
}

export const useVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    playbackRate: 1,
  });

  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (videoRef.current && !isNaN(time) && isFinite(time)) {
      console.log("Seeking to time:", time, "Duration:", videoRef.current.duration);
      videoRef.current.currentTime = Math.max(0, Math.min(time, videoRef.current.duration || 0));
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const isMuted = !state.isMuted;
      videoRef.current.muted = isMuted;
      setState(prev => ({ ...prev, isMuted }));
    }
  }, [state.isMuted]);

  const setPlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setState(prev => ({ ...prev, playbackRate: rate }));
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setState(prev => ({ ...prev, isFullscreen: true }));
      } else {
        document.exitFullscreen();
        setState(prev => ({ ...prev, isFullscreen: false }));
      }
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setState(prev => ({
        ...prev,
        currentTime: videoRef.current!.currentTime,
        duration: videoRef.current!.duration || 0,
      }));
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setState(prev => ({
        ...prev,
        duration: videoRef.current!.duration || 0,
      }));
    }
  }, []);

  const handleDurationChange = useCallback(() => {
    if (videoRef.current) {
      setState(prev => ({
        ...prev,
        duration: videoRef.current!.duration || 0,
      }));
    }
  }, []);

  const handleEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  return {
    videoRef,
    state,
    controls: {
      play,
      pause,
      seekTo,
      setVolume,
      toggleMute,
      setPlaybackRate,
      toggleFullscreen,
    },
    handlers: {
      onTimeUpdate: handleTimeUpdate,
      onLoadedMetadata: handleLoadedMetadata,
      onDurationChange: handleDurationChange,
      onEnded: handleEnded,
    },
  };
};
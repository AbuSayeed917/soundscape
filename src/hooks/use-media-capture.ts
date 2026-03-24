"use client";

import { useCallback, useRef, useState } from "react";

export function useMediaCapture() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Use ref for mic stream to avoid stale closures (fixes #4)
  const micStreamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setIsCapturing(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(dataUrl);

    // Stop camera after capture
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCapturing(false);

    return dataUrl;
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCapturing(false);
  }, []);

  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setIsMicActive(true);
      return stream;
    } catch {
      return null;
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    setIsMicActive(false);
  }, []);

  const clearImage = useCallback(() => {
    setCapturedImage(null);
  }, []);

  return {
    capturedImage,
    isCapturing,
    isMicActive,
    videoRef,
    startCamera,
    capturePhoto,
    stopCamera,
    startMicrophone,
    stopMicrophone,
    clearImage,
  };
}

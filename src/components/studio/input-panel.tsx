"use client";

import { motion } from "motion/react";
import { Camera, Mic, MicOff, Cloud, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeatherData } from "@/types";

interface InputPanelProps {
  isCapturing: boolean;
  capturedImage: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onStartCamera: () => void;
  onCapturePhoto: () => void;
  onStopCamera: () => void;
  onClearImage: () => void;
  isMicActive: boolean;
  onStartMic: () => void;
  onStopMic: () => void;
  weather: WeatherData | null;
  weatherLoading: boolean;
  onRefetchWeather: () => void;
}

const WEATHER_EMOJI: Record<WeatherData["condition"], string> = {
  clear: "☀️",
  cloudy: "☁️",
  rain: "🌧️",
  snow: "❄️",
  storm: "⛈️",
  fog: "🌫️",
  wind: "💨",
};

const TIME_EMOJI: Record<WeatherData["timeOfDay"], string> = {
  dawn: "🌅",
  morning: "🌤️",
  afternoon: "☀️",
  evening: "🌇",
  night: "🌙",
};

export function InputPanel({
  isCapturing,
  capturedImage,
  videoRef,
  onStartCamera,
  onCapturePhoto,
  onStopCamera,
  onClearImage,
  isMicActive,
  onStartMic,
  onStopMic,
  weather,
  weatherLoading,
  onRefetchWeather,
}: InputPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Inputs
      </h3>

      {/* Camera Input */}
      <div className="overflow-hidden rounded-2xl border-2 border-border bg-card cartoon-shadow">
        <div className="flex items-center justify-between p-3 pb-0">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#FF6B6B]">
              <Camera className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold">Camera</span>
          </div>
          {capturedImage && (
            <Button size="icon-xs" variant="ghost" onClick={onClearImage} aria-label="Clear photo">
              <X className="size-3" />
            </Button>
          )}
        </div>
        <div className="p-3">
          {isCapturing ? (
            <div className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={onCapturePhoto}
                  className="flex-1 rounded-xl bg-[#FF6B6B] font-bold text-white hover:bg-[#FF5252]"
                >
                  Snap!
                </Button>
                <Button size="sm" variant="outline" onClick={onStopCamera} className="rounded-xl border-2 font-bold">
                  Cancel
                </Button>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="relative aspect-video overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedImage} alt="Captured scene" className="h-full w-full object-cover" />
              <span className="absolute bottom-2 left-2 rounded-full bg-[#A8E6CF] px-3 py-0.5 text-xs font-bold text-[#2C3E50]">
                Captured!
              </span>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={onStartCamera}
              className="w-full gap-2 rounded-xl border-2 border-dashed font-bold hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
            >
              <ImageIcon className="size-3.5" />
              Take Photo
            </Button>
          )}
        </div>
      </div>

      {/* Microphone Input */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3 cartoon-shadow">
        <div
          className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
            isMicActive ? "bg-[#4ECDC4]" : "bg-secondary"
          }`}
        >
          {isMicActive ? (
            <Mic className="size-4 text-white" />
          ) : (
            <MicOff className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Microphone</p>
          <p className="text-xs text-muted-foreground">
            {isMicActive ? "Listening..." : "Capture ambient audio"}
          </p>
        </div>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            size="sm"
            onClick={isMicActive ? onStopMic : onStartMic}
            className={`rounded-xl font-bold ${
              isMicActive
                ? "bg-[#FF4757] text-white hover:bg-[#FF3344]"
                : "bg-[#4ECDC4] text-white hover:bg-[#3DB8B0]"
            }`}
          >
            {isMicActive ? "Stop" : "Start"}
          </Button>
        </motion.div>
        {isMicActive && (
          <motion.div
            className="size-3 rounded-full bg-[#4ECDC4]"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Weather Input */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-3 cartoon-shadow">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#FFE66D] text-lg">
          {weather ? WEATHER_EMOJI[weather.condition] : <Cloud className="size-4 text-[#2C3E50]" />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">Weather & Time</p>
          {weather ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{weather.temperature}°C</span>
              <span>·</span>
              <span className="capitalize">{weather.condition}</span>
              <span>·</span>
              <span>
                {TIME_EMOJI[weather.timeOfDay]} {weather.timeOfDay}
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {weatherLoading ? "Detecting..." : "Click to detect"}
            </p>
          )}
        </div>
        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefetchWeather}
            className="rounded-xl text-[#FFE66D] hover:bg-[#FFFDE6]"
            aria-label="Refresh weather"
          >
            <Cloud className="size-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

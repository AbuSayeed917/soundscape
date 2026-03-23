"use client";

import { motion } from "motion/react";
import { Camera, Mic, MicOff, Cloud, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeatherData } from "@/types";

interface InputPanelProps {
  // Camera
  isCapturing: boolean;
  capturedImage: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onStartCamera: () => void;
  onCapturePhoto: () => void;
  onStopCamera: () => void;
  onClearImage: () => void;
  // Mic
  isMicActive: boolean;
  onStartMic: () => void;
  onStopMic: () => void;
  // Weather
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
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Inputs
      </h3>

      {/* Camera Input */}
      <Card className="overflow-hidden border-border bg-card/60 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Camera className="size-4 text-primary" />
            Camera
          </CardTitle>
          {capturedImage && (
            <Button size="icon-xs" variant="ghost" onClick={onClearImage} aria-label="Clear photo">
              <X className="size-3" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-3">
          {isCapturing ? (
            <div className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  playsInline
                  muted
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={onCapturePhoto} className="flex-1">
                  Capture
                </Button>
                <Button size="sm" variant="outline" onClick={onStopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Captured scene"
                className="h-full w-full object-cover"
              />
              <Badge className="absolute bottom-2 left-2" variant="secondary">
                Captured
              </Badge>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={onStartCamera}
              className="w-full gap-2"
            >
              <ImageIcon className="size-3.5" />
              Take Photo
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Microphone Input */}
      <Card className="border-border bg-card/60 backdrop-blur-md">
        <CardContent className="flex items-center gap-3 p-3">
          <div
            className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
              isMicActive ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
            }`}
          >
            {isMicActive ? <Mic className="size-4" /> : <MicOff className="size-4" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Microphone</p>
            <p className="text-xs text-muted-foreground">
              {isMicActive ? "Listening to ambient sound..." : "Capture environmental audio"}
            </p>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant={isMicActive ? "destructive" : "outline"}
              onClick={isMicActive ? onStopMic : onStartMic}
            >
              {isMicActive ? "Stop" : "Start"}
            </Button>
          </motion.div>

          {/* Pulse indicator when active */}
          {isMicActive && (
            <motion.div
              className="size-2 rounded-full bg-primary"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </CardContent>
      </Card>

      {/* Weather Input */}
      <Card className="border-border bg-card/60 backdrop-blur-md">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-lg">
            {weather ? WEATHER_EMOJI[weather.condition] : <Cloud className="size-4 text-muted-foreground" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Weather & Time</p>
            {weather ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{weather.temperature}°C</span>
                <span>·</span>
                <span className="capitalize">{weather.condition}</span>
                <span>·</span>
                <span>{TIME_EMOJI[weather.timeOfDay]} {weather.timeOfDay}</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {weatherLoading ? "Detecting location..." : "Click refresh to detect"}
              </p>
            )}
          </div>
          <Button size="sm" variant="ghost" onClick={onRefetchWeather} aria-label="Refresh weather">
            <Cloud className="size-3.5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

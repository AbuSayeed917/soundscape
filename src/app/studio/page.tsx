"use client";

import dynamic from "next/dynamic";
import { StudioHeader } from "@/components/studio/studio-header";
import { Visualizer } from "@/components/studio/visualizer";
import { Controls } from "@/components/studio/controls";
import { LayerMixer } from "@/components/studio/layer-mixer";
import { InputPanel } from "@/components/studio/input-panel";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { useWeather } from "@/hooks/use-weather";
import { useMediaCapture } from "@/hooks/use-media-capture";

const StudioScene = dynamic(
  () => import("@/components/three/studio-scene").then((m) => m.StudioScene),
  { ssr: false },
);

export default function StudioPage() {
  const {
    isPlaying,
    parameters,
    analyserData,
    play,
    stop,
    toggleLayer,
    setLayerVolume,
    updateParameters,
  } = useAudioEngine();

  const { weather, loading: weatherLoading, refetch: refetchWeather } = useWeather();

  const {
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
  } = useMediaCapture();

  return (
    <div className="flex h-dvh flex-col bg-background">
      <StudioHeader isPlaying={isPlaying} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — Inputs */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r-2 border-border bg-secondary/30 p-4 lg:block">
          <InputPanel
            isCapturing={isCapturing}
            capturedImage={capturedImage}
            videoRef={videoRef}
            onStartCamera={startCamera}
            onCapturePhoto={capturePhoto}
            onStopCamera={stopCamera}
            onClearImage={clearImage}
            isMicActive={isMicActive}
            onStartMic={startMicrophone}
            onStopMic={stopMicrophone}
            weather={weather}
            weatherLoading={weatherLoading}
            onRefetchWeather={refetchWeather}
          />
        </aside>

        {/* Main area — Visualizer + 3D */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="relative flex-1 p-4">
            {/* 3D Scene behind visualizer */}
            <StudioScene isPlaying={isPlaying} />

            {/* Visualizer canvas */}
            <div className="relative z-10 h-full overflow-hidden rounded-3xl border-2 border-border bg-card/80 cartoon-shadow-lg backdrop-blur-sm">
              <Visualizer analyserData={analyserData} isPlaying={isPlaying} />
            </div>

            {/* Floating controls overlay (mobile) */}
            <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 lg:hidden">
              <div className="rounded-full border-2 border-border bg-card p-4 cartoon-shadow-lg">
                <Controls
                  isPlaying={isPlaying}
                  parameters={parameters}
                  onPlay={play}
                  onStop={stop}
                  onUpdateParams={updateParameters}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Right sidebar — Controls & Layers */}
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l-2 border-border bg-secondary/30 p-4 xl:block">
          <div className="space-y-6">
            <Controls
              isPlaying={isPlaying}
              parameters={parameters}
              onPlay={play}
              onStop={stop}
              onUpdateParams={updateParameters}
            />

            <div className="h-0.5 rounded-full bg-border" />

            <LayerMixer
              layers={parameters.layers}
              onToggle={toggleLayer}
              onVolumeChange={setLayerVolume}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

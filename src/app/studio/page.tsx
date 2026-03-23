"use client";

import { StudioHeader } from "@/components/studio/studio-header";
import { Visualizer } from "@/components/studio/visualizer";
import { Controls } from "@/components/studio/controls";
import { LayerMixer } from "@/components/studio/layer-mixer";
import { InputPanel } from "@/components/studio/input-panel";
import { useAudioEngine } from "@/hooks/use-audio-engine";
import { useWeather } from "@/hooks/use-weather";
import { useMediaCapture } from "@/hooks/use-media-capture";

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
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-card/20 p-4 backdrop-blur-md lg:block">
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

        {/* Main area — Visualizer */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Visualizer canvas */}
          <div className="relative flex-1 p-4">
            <div className="h-full overflow-hidden rounded-2xl border border-border bg-card/30 backdrop-blur-md">
              <Visualizer
                analyserData={analyserData}
                isPlaying={isPlaying}
              />
            </div>

            {/* Floating controls overlay (mobile) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden">
              <div className="glass rounded-full border border-border px-6 py-3">
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
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-border bg-card/20 p-4 backdrop-blur-md xl:block">
          <div className="space-y-6">
            <Controls
              isPlaying={isPlaying}
              parameters={parameters}
              onPlay={play}
              onStop={stop}
              onUpdateParams={updateParameters}
            />

            <div className="h-px bg-border" />

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

import { WaveformIcon } from "@/components/shared/waveform-icon";

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-secondary px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-[#FF6B6B] cartoon-shadow">
            <WaveformIcon bars={3} animate={false} className="h-3 [&>div]:bg-white" />
          </div>
          <span className="text-base font-black">SoundScape</span>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          AI-powered generative music from your world. Built with Next.js, Tone.js & React Three Fiber.
        </p>
        <p className="text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} SoundScape. Open source.
        </p>
      </div>
    </footer>
  );
}

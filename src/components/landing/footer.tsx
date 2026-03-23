import { WaveformIcon } from "@/components/shared/waveform-icon";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 px-6 py-12 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <WaveformIcon bars={4} animate={false} className="h-4" />
          <span className="text-sm font-semibold">SoundScape</span>
        </div>
        <p className="text-xs text-muted-foreground">
          AI-powered generative music from your world. Built with Next.js, Tone.js, and love.
        </p>
        <p className="text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} SoundScape. Open source.
        </p>
      </div>
    </footer>
  );
}

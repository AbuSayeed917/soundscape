"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AudioLayer, SoundParameters } from "@/types";

const DEFAULT_LAYERS: AudioLayer[] = [
  { id: "pad", name: "Ambient Pad", type: "pad", volume: 0.6, active: true, color: "#22d3ee" },
  { id: "bass", name: "Sub Bass", type: "bass", volume: 0.4, active: true, color: "#a78bfa" },
  { id: "arp", name: "Arpeggio", type: "arpeggio", volume: 0.3, active: false, color: "#34d399" },
  { id: "perc", name: "Percussion", type: "percussion", volume: 0.5, active: false, color: "#fb923c" },
  { id: "synth", name: "Lead Synth", type: "synth", volume: 0.35, active: false, color: "#f472b6" },
  { id: "ambient", name: "Field Recording", type: "ambient", volume: 0.25, active: true, color: "#60a5fa" },
];

const NOTE_MAP: Record<string, string[]> = {
  C: ["C3", "E3", "G3", "B3", "D4", "F4", "A4", "C5"],
  D: ["D3", "F#3", "A3", "C#4", "E4", "G4", "B4", "D5"],
  E: ["E3", "G#3", "B3", "D#4", "F#4", "A4", "C#5", "E5"],
  F: ["F3", "A3", "C4", "E4", "G4", "Bb4", "D5", "F5"],
  G: ["G3", "B3", "D4", "F#4", "A4", "C5", "E5", "G5"],
  A: ["A3", "C#4", "E4", "G#4", "B4", "D5", "F#5", "A5"],
  B: ["B3", "D#4", "F#4", "A#4", "C#5", "E5", "G#5", "B5"],
};

export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [parameters, setParameters] = useState<SoundParameters>({
    tempo: 72,
    key: "C",
    scale: "pentatonic",
    mood: "calm",
    layers: DEFAULT_LAYERS,
  });
  const [analyserData, setAnalyserData] = useState<Float32Array | null>(null);

  const toneRef = useRef<typeof import("tone") | null>(null);
  const synthsRef = useRef<Map<string, unknown>>(new Map());
  const loopsRef = useRef<Map<string, unknown>>(new Map());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  // Initialize Tone.js lazily
  const initTone = useCallback(async () => {
    if (toneRef.current) return toneRef.current;
    const Tone = await import("tone");
    await Tone.start();
    toneRef.current = Tone;

    // Set up analyser for visualization
    const ctx = Tone.getContext().rawContext;
    if (ctx) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      Tone.getDestination().connect(analyser);
      analyserRef.current = analyser;
    }

    setIsReady(true);
    return Tone;
  }, []);

  // Create synths for each layer
  const createSynths = useCallback(
    async (params: SoundParameters) => {
      const Tone = await initTone();
      // Clean up existing
      synthsRef.current.forEach((synth) => {
        if (synth && typeof synth === "object" && "dispose" in synth) {
          (synth as { dispose: () => void }).dispose();
        }
      });
      loopsRef.current.forEach((loop) => {
        if (loop && typeof loop === "object" && "dispose" in loop) {
          (loop as { dispose: () => void }).dispose();
        }
      });
      synthsRef.current.clear();
      loopsRef.current.clear();

      Tone.getTransport().bpm.value = params.tempo;
      const notes = NOTE_MAP[params.key] || NOTE_MAP["C"];

      for (const layer of params.layers) {
        if (!layer.active) continue;

        let synth: unknown;
        let pattern: unknown;

        switch (layer.type) {
          case "pad": {
            const s = new Tone.PolySynth(Tone.Synth, {
              oscillator: { type: "sine" },
              envelope: { attack: 2, decay: 1, sustain: 0.8, release: 3 },
              volume: Tone.gainToDb(layer.volume) - 12,
            }).toDestination();
            const p = new Tone.Loop((time: number) => {
              s.triggerAttackRelease([notes[0], notes[2], notes[4]], "2n", time);
            }, "1m");
            synth = s;
            pattern = p;
            break;
          }
          case "bass": {
            const s = new Tone.MonoSynth({
              oscillator: { type: "triangle" },
              filter: { Q: 2, type: "lowpass", frequency: 400 },
              envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 0.8 },
              volume: Tone.gainToDb(layer.volume) - 6,
            }).toDestination();
            const p = new Tone.Loop((time: number) => {
              const noteIdx = Math.floor(Math.random() * 3);
              s.triggerAttackRelease(notes[noteIdx], "4n", time);
            }, "2n");
            synth = s;
            pattern = p;
            break;
          }
          case "arpeggio": {
            const s = new Tone.Synth({
              oscillator: { type: "sawtooth" },
              envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.4 },
              volume: Tone.gainToDb(layer.volume) - 10,
            }).toDestination();
            let noteIndex = 0;
            const p = new Tone.Loop((time: number) => {
              s.triggerAttackRelease(notes[noteIndex % notes.length], "16n", time);
              noteIndex++;
            }, "8n");
            synth = s;
            pattern = p;
            break;
          }
          case "percussion": {
            const s = new Tone.MembraneSynth({
              volume: Tone.gainToDb(layer.volume) - 8,
            }).toDestination();
            const p = new Tone.Loop((time: number) => {
              s.triggerAttackRelease("C1", "8n", time);
            }, "1n");
            synth = s;
            pattern = p;
            break;
          }
          case "synth": {
            const s = new Tone.Synth({
              oscillator: { type: "square" },
              envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.8 },
              volume: Tone.gainToDb(layer.volume) - 14,
            }).toDestination();
            const p = new Tone.Loop((time: number) => {
              const noteIdx = Math.floor(Math.random() * notes.length);
              s.triggerAttackRelease(notes[noteIdx], "4n", time);
            }, "1m");
            synth = s;
            pattern = p;
            break;
          }
          case "ambient": {
            const s = new Tone.Noise({
              type: "pink",
              volume: Tone.gainToDb(layer.volume) - 20,
            }).toDestination();
            synth = s;
            break;
          }
        }

        if (synth) synthsRef.current.set(layer.id, synth);
        if (pattern) loopsRef.current.set(layer.id, pattern);
      }
    },
    [initTone],
  );

  const play = useCallback(async () => {
    const Tone = await initTone();
    await createSynths(parameters);

    loopsRef.current.forEach((loop) => {
      if (loop && typeof loop === "object" && "start" in loop) {
        (loop as { start: (t: number) => void }).start(0);
      }
    });

    // Start noise-type synths
    synthsRef.current.forEach((synth, id) => {
      const layer = parameters.layers.find((l) => l.id === id);
      if (layer?.type === "ambient" && synth && typeof synth === "object" && "start" in synth) {
        (synth as { start: () => void }).start();
      }
    });

    Tone.getTransport().start();
    setIsPlaying(true);

    // Start analyser animation loop
    const updateAnalyser = () => {
      if (analyserRef.current) {
        const data = new Float32Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getFloatFrequencyData(data);
        setAnalyserData(new Float32Array(data));
      }
      animFrameRef.current = requestAnimationFrame(updateAnalyser);
    };
    updateAnalyser();
  }, [initTone, createSynths, parameters]);

  const stop = useCallback(async () => {
    const Tone = toneRef.current;
    if (!Tone) return;

    Tone.getTransport().stop();
    loopsRef.current.forEach((loop) => {
      if (loop && typeof loop === "object" && "stop" in loop) {
        (loop as { stop: () => void }).stop();
      }
    });
    synthsRef.current.forEach((synth) => {
      if (synth && typeof synth === "object" && "stop" in synth) {
        (synth as { stop: () => void }).stop();
      }
    });

    cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
  }, []);

  const toggleLayer = useCallback(
    (layerId: string) => {
      setParameters((prev) => ({
        ...prev,
        layers: prev.layers.map((l) => (l.id === layerId ? { ...l, active: !l.active } : l)),
      }));
    },
    [],
  );

  const setLayerVolume = useCallback(
    (layerId: string, volume: number) => {
      setParameters((prev) => ({
        ...prev,
        layers: prev.layers.map((l) => (l.id === layerId ? { ...l, volume } : l)),
      }));
    },
    [],
  );

  const updateParameters = useCallback((updates: Partial<SoundParameters>) => {
    setParameters((prev) => ({ ...prev, ...updates }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      synthsRef.current.forEach((synth) => {
        if (synth && typeof synth === "object" && "dispose" in synth) {
          (synth as { dispose: () => void }).dispose();
        }
      });
      loopsRef.current.forEach((loop) => {
        if (loop && typeof loop === "object" && "dispose" in loop) {
          (loop as { dispose: () => void }).dispose();
        }
      });
    };
  }, []);

  return {
    isPlaying,
    isReady,
    parameters,
    analyserData,
    play,
    stop,
    toggleLayer,
    setLayerVolume,
    updateParameters,
  };
}

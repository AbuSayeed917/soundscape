/** Represents a single audio input source in the SoundScape mixer */
export type InputSource = "microphone" | "camera" | "weather" | "manual";

/** Audio parameter set derived from AI analysis */
export interface SoundParameters {
  tempo: number; // BPM 40-180
  key: MusicalKey;
  scale: "major" | "minor" | "pentatonic" | "dorian" | "mixolydian";
  mood: Mood;
  layers: AudioLayer[];
}

export type MusicalKey =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

export type Mood =
  | "calm"
  | "energetic"
  | "melancholic"
  | "dreamy"
  | "intense"
  | "playful"
  | "mysterious";

export interface AudioLayer {
  id: string;
  name: string;
  type: "synth" | "pad" | "bass" | "percussion" | "ambient" | "arpeggio";
  volume: number; // 0-1
  active: boolean;
  color: string;
}

/** Weather data used to influence soundscape */
export interface WeatherData {
  condition: "clear" | "cloudy" | "rain" | "snow" | "storm" | "fog" | "wind";
  temperature: number;
  humidity: number;
  windSpeed: number;
  timeOfDay: "dawn" | "morning" | "afternoon" | "evening" | "night";
}

/** Node in the visual mixer graph */
export interface MixerNode {
  id: string;
  type: InputSource | "output" | "effect";
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

/** Connection between two mixer nodes */
export interface MixerConnection {
  id: string;
  from: string;
  to: string;
}

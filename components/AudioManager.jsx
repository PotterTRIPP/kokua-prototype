"use client";
import { useEffect, useRef, useState } from "react";

// AMBIENT LOOPS (We still try to load these, but fail gracefully if they break)
const AMBIENT_TRACKS = {
  bg_builder: "https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d3/Wind_in_the_trees.ogg/Wind_in_the_trees.ogg.mp3",
  bg_explorer: "https://upload.wikimedia.org/wikipedia/commons/transcoded/b/b5/Ocean_Waves.ogg/Ocean_Waves.ogg.mp3",
  bg_gardener: "https://upload.wikimedia.org/wikipedia/commons/transcoded/e/e7/Forest_ambience.ogg/Forest_ambience.ogg.mp3",
};

export default function AudioManager({ archetype, triggerSFX }) {
  const bgAudioRef = useRef(null);
  const audioCtxRef = useRef(null); // The Synthesizer
  const [hasInteracted, setHasInteracted] = useState(false);

  // 1. INITIALIZE SYNTHESIZER
  useEffect(() => {
    // We create the AudioContext only once
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();
  }, []);

  // HELPER: Play a synthesized tone
  const playTone = (freq, type, duration, delay = 0) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type; // 'sine', 'square', 'triangle'
    osc.frequency.value = freq;
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime + delay;
    osc.start(now);
    
    // Fade out to avoid clicking sound
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.stop(now + duration);
  };

  // 2. SFX PLAYER (The Synth)
  useEffect(() => {
    if (!triggerSFX) return;
    
    // Resume context if it was suspended (browser policy)
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (triggerSFX === "coin_collect") {
      // COIN SOUND: High pitch, short ping
      playTone(1200, 'sine', 0.1); // High note
      playTone(1800, 'sine', 0.1, 0.05); // Higher note slightly later
    } 
    
    else if (triggerSFX === "level_up") {
      // LEVEL UP: Major Chord Arpeggio (C - E - G - C)
      playTone(523.25, 'triangle', 0.3, 0);    // C5
      playTone(659.25, 'triangle', 0.3, 0.1);  // E5
      playTone(783.99, 'triangle', 0.3, 0.2);  // G5
      playTone(1046.50, 'triangle', 0.6, 0.3); // C6 (Longer)
    }

  }, [triggerSFX]);

  // 3. AMBIENT AUDIO (File based)
  useEffect(() => {
    if (!archetype) return;

    const trackUrl = AMBIENT_TRACKS[`bg_${archetype}`] || AMBIENT_TRACKS.bg_explorer;

    if (!bgAudioRef.current) {
      if (typeof Audio !== "undefined") {
        bgAudioRef.current = new Audio(trackUrl);
        bgAudioRef.current.loop = true;
        bgAudioRef.current.volume = 0.3;
      }
    } else {
      if (bgAudioRef.current.src !== trackUrl) {
         bgAudioRef.current.src = trackUrl;
      }
    }

    const startBg = () => {
      setHasInteracted(true);
      bgAudioRef.current.play().catch(e => console.log("Ambient waiting..."));
    };

    window.addEventListener('click', startBg, { once: true });
    
    if (hasInteracted) {
      bgAudioRef.current.play().catch(e => console.log("Ambient waiting..."));
    }
  }, [archetype, hasInteracted]);

  return null;
}
import { readStorage } from "../utils/storage.js";

let audioContext;

function isSoundEnabled() {
    return readStorage("bspaceSound", "false") === "true";
}

export function playTone(frequency, forced = false) {
    if ((!isSoundEnabled() && !forced) || !("AudioContext" in window || "webkitAudioContext" in window)) {
        return;
    }

    const AudioApi = window.AudioContext || window.webkitAudioContext;
    audioContext = audioContext || new AudioApi();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.18);
}

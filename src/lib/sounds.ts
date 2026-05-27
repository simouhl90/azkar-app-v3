/**
 * Sound Effects System using Web Audio API
 * Generates tones programmatically - no external audio files needed
 */

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  /**
   * Initialize the audio context (must be called from user gesture)
   */
  init(): void {
    if (this.audioContext) return;
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext)();
    } catch {
      console.warn('[SoundManager] Web Audio API not supported');
    }
  }

  /**
   * Set whether sounds are enabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Ensure audio context is running
   */
  private ensureContext(): AudioContext | null {
    if (!this.audioContext || !this.enabled) return null;
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * Create an oscillator node with the given parameters
   */
  private createTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainValue: number = 0.15,
    delay: number = 0
  ): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;

    // Create oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    // Create gain for volume envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(gainValue, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.01);
  }

  /**
   * Play a soft, pleasant tap/click sound
   */
  playTap(): void {
    this.init();
    // A soft high-pitched click - short sine wave
    this.createTone(800, 0.08, 'sine', 0.1);
  }

  /**
   * Play a celebratory chime - completion sound
   */
  playComplete(): void {
    this.init();
    // Ascending chime with two harmonious notes
    this.createTone(523.25, 0.25, 'sine', 0.12, 0);     // C5
    this.createTone(659.25, 0.25, 'sine', 0.12, 0.1);    // E5
    this.createTone(783.99, 0.4, 'sine', 0.15, 0.2);    // G5
  }

  /**
   * Play a fanfare - target reached sound
   */
  playTargetReached(): void {
    this.init();
    // Triumphant ascending arpeggio
    this.createTone(523.25, 0.2, 'sine', 0.12, 0);      // C5
    this.createTone(659.25, 0.2, 'sine', 0.12, 0.12);   // E5
    this.createTone(783.99, 0.2, 'sine', 0.12, 0.24);   // G5
    this.createTone(1046.50, 0.6, 'sine', 0.18, 0.36);  // C6
    // Final shimmer
    this.createTone(1318.51, 0.8, 'sine', 0.08, 0.5);   // E6
  }
}

// Singleton instance
let soundManager: SoundManager | null = null;

/**
 * Get or create the SoundManager singleton
 */
export function getSoundManager(): SoundManager {
  if (!soundManager) {
    soundManager = new SoundManager();
  }
  return soundManager;
}

// Convenience functions for direct use
export function playTapSound(): void {
  getSoundManager().playTap();
}

export function playCompletionSound(): void {
  getSoundManager().playComplete();
}

export function playTargetReachedSound(): void {
  getSoundManager().playTargetReached();
}

export { SoundManager };

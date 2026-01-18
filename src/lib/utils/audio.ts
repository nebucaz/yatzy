/**
 * Audio playback utility
 * Plays the first 8 seconds of "Seven Nation Army" when Yatzy is achieved
 */

let yatzyAudio: HTMLAudioElement | null = null;

export function playYatzySound() {
	if (typeof window === 'undefined') return;

	// Create audio element if it doesn't exist
	if (!yatzyAudio) {
		yatzyAudio = new Audio('/seven-nation-army.mp3');
		yatzyAudio.preload = 'auto';
	}

	// Reset to beginning and play
	yatzyAudio.currentTime = 0;
	
	// Play the audio
	const playPromise = yatzyAudio.play();
	
	if (playPromise !== undefined) {
		playPromise
			.then(() => {
				// Audio started playing successfully
				// Stop after 8 seconds
				setTimeout(() => {
					if (yatzyAudio) {
						yatzyAudio.pause();
						yatzyAudio.currentTime = 0;
					}
				}, 8000);
			})
			.catch((error) => {
				// Auto-play was prevented or audio failed to load
				console.warn('Audio playback failed:', error);
			});
	}
}

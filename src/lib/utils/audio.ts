/**
 * Audio playback utility
 * Plays the first 8 seconds of "Seven Nation Army" when Yatzy is achieved
 */

let yatzyAudio: HTMLAudioElement | null = null;
let isPreloading = false;
let isPreloaded = false;

/**
 * Preload the audio file in the background when the page loads
 * This ensures the audio is ready to play immediately when needed
 */
export function preloadYatzySound() {
	if (typeof window === 'undefined' || isPreloading || isPreloaded) return;

	isPreloading = true;

	// Create audio element and start loading
	if (!yatzyAudio) {
		yatzyAudio = new Audio('/seven-nation-army.mp3');
		yatzyAudio.preload = 'auto';
		
		// Explicitly load the audio
		const loadPromise = yatzyAudio.load();
		
		if (loadPromise !== undefined) {
			loadPromise
				.then(() => {
					isPreloaded = true;
					isPreloading = false;
				})
				.catch((error) => {
					console.warn('Audio preload failed:', error);
					isPreloading = false;
				});
		} else {
			// Fallback: use canplaythrough event
			yatzyAudio.addEventListener('canplaythrough', () => {
				isPreloaded = true;
				isPreloading = false;
			}, { once: true });
			
			// Also handle errors
			yatzyAudio.addEventListener('error', () => {
				console.warn('Audio preload error');
				isPreloading = false;
			}, { once: true });
		}
	}
}

export function playYatzySound() {
	if (typeof window === 'undefined') return;

	// Create audio element if it doesn't exist (fallback if preload wasn't called)
	if (!yatzyAudio) {
		yatzyAudio = new Audio('/seven-nation-army.mp3');
		yatzyAudio.preload = 'auto';
		// Try to load it now
		yatzyAudio.load();
	}

	// Wait for audio to be ready if it's still loading
	const playAudio = () => {
		// Reset to beginning and play
		yatzyAudio!.currentTime = 0;
		
		// Play the audio
		const playPromise = yatzyAudio!.play();
		
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
	};

	// If audio is ready, play immediately; otherwise wait for it
	if (yatzyAudio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
		playAudio();
	} else {
		// Wait for audio to be ready
		const onCanPlay = () => {
			playAudio();
			yatzyAudio!.removeEventListener('canplay', onCanPlay);
		};
		yatzyAudio.addEventListener('canplay', onCanPlay);
	}
}

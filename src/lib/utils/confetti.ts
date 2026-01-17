/**
 * Confetti explosion effect - adapted from Angular component
 * Starts from bottom, throws confetti up, then falls down with realistic physics
 */

interface Confetto {
	color: { front: string; back: string };
	dimensions: { x: number; y: number };
	position: { x: number; y: number };
	rotation: number;
	scale: { x: number; y: number };
	velocity: { x: number; y: number };
}

export function triggerConfetti() {
	if (typeof window === 'undefined') return;

	const canvas = document.createElement('canvas');
	canvas.id = 'confetti-canvas';
	canvas.style.position = 'fixed';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.style.pointerEvents = 'none';
	canvas.style.zIndex = '9999';
	document.body.appendChild(canvas);

	const ctx = canvas.getContext('2d');
	if (!ctx) {
		document.body.removeChild(canvas);
		return;
	}

	// Configuration
	const confettiCount = 300;
	const gravity = 0.7;
	const terminalVelocity = 5;
	const drag = 0.075;

	// Colors with front/back for 3D effect
	const colors = [
		{ front: '#c0c0c0', back: '#A9A9A9' }, // silver
		{ front: '#eeeeee', back: '#D3D3D3' }, // white
		{ front: 'pink', back: 'darkpink' },
		{ front: '#F5DEB3', back: '#D2B48C' }, // wheat/tan
		{ front: '#DEB887', back: '#A0522D' }, // burlywood/sienna
		{ front: '#FA8072', back: '#FFA07A' }, // salmon
		{ front: '#FFD700', back: '#DAA520' }, // gold
		{ front: '#FF6B6B', back: '#CC5555' }, // red
		{ front: '#4ECDC4', back: '#3BA89F' }, // teal
		{ front: '#45B7D1', back: '#3692A8' } // blue
	];

	const randomRange = (min: number, max: number): number => {
		return Math.random() * (max - min) + min;
	};

	let confetti: Confetto[] = [];
	let animReq: number | null = null;

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function initConfetti() {
		confetti = [];
		resizeCanvas();

		// Create confetti starting from bottom center, exploding upward
		const centerX = canvas.width / 2;
		const startY = canvas.height - 1;

		for (let i = 0; i < confettiCount; i++) {
			confetti.push({
				color: colors[Math.floor(randomRange(0, colors.length))],
				dimensions: {
					x: randomRange(10, 20),
					y: randomRange(10, 30)
				},
				position: {
					// Start from center with some spread
					x: centerX + randomRange(-50, 50),
					y: startY
				},
				rotation: randomRange(0, 2 * Math.PI),
				scale: {
					x: 1,
					y: 1
				},
				velocity: {
					// Explode outward and upward
					x: randomRange(-25, 25),
					y: randomRange(0, -50) // Negative Y means upward
				}
			});
		}
	}

	function render() {
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		confetti.forEach((confetto, index) => {
			const width = confetto.dimensions.x * confetto.scale.x;
			const height = confetto.dimensions.y * confetto.scale.y;

			// Move canvas to position and rotate
			ctx.save();
			ctx.translate(confetto.position.x, confetto.position.y);
			ctx.rotate(confetto.rotation);

			// Apply forces to velocity
			confetto.velocity.x -= confetto.velocity.x * drag;
			confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
			confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

			// Set position
			confetto.position.x += confetto.velocity.x;
			confetto.position.y += confetto.velocity.y;

			// Delete confetti when out of frame (below bottom)
			if (confetto.position.y >= canvas.height) {
				confetti.splice(index, 1);
				ctx.restore();
				return;
			}

			// Loop confetto x position (wrap around sides)
			if (confetto.position.x > canvas.width) confetto.position.x = 0;
			if (confetto.position.x < 0) confetto.position.x = canvas.width;

			// Spin confetto by scaling y (creates 3D rotation effect)
			confetto.scale.y = Math.cos(confetto.position.y * 0.1);
			ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

			// Draw confetto as rectangle
			ctx.fillRect(-width / 2, -height / 2, width, height);

			ctx.restore();
		});

		// Continue animation if confetti still exists
		if (confetti.length > 0) {
			animReq = requestAnimationFrame(render);
		} else {
			// Clean up when done
			if (animReq !== null) {
				cancelAnimationFrame(animReq);
			}
			document.body.removeChild(canvas);
		}
	}

	// Handle window resize
	const handleResize = () => {
		resizeCanvas();
	};
	window.addEventListener('resize', handleResize);

	// Initialize and start animation
	initConfetti();
	render();

	// Cleanup function (in case we need to stop early)
	return () => {
		window.removeEventListener('resize', handleResize);
		if (animReq !== null) {
			cancelAnimationFrame(animReq);
		}
		if (document.body.contains(canvas)) {
			document.body.removeChild(canvas);
		}
	};
}

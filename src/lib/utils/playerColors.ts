/**
 * A well-chosen color scheme for player columns.
 * Colors are selected to be easily distinguishable and accessible.
 */
export const PLAYER_COLORS = [
	{ name: 'Blue', header: '#4A90E2', cell: '#E3F2FD', text: '#1565C0' },
	{ name: 'Green', header: '#50C878', cell: '#E8F5E9', text: '#2E7D32' },
	{ name: 'Orange', header: '#FF9800', cell: '#FFF3E0', text: '#E65100' },
	{ name: 'Purple', header: '#9C27B0', cell: '#F3E5F5', text: '#6A1B9A' },
	{ name: 'Red', header: '#E91E63', cell: '#FCE4EC', text: '#C2185B' },
	{ name: 'Teal', header: '#009688', cell: '#E0F2F1', text: '#00695C' },
	{ name: 'Amber', header: '#FFC107', cell: '#FFF8E1', text: '#F57C00' },
	{ name: 'Indigo', header: '#3F51B5', cell: '#E8EAF6', text: '#283593' },
	{ name: 'Pink', header: '#EC407A', cell: '#FCE4EC', text: '#C2185B' },
	{ name: 'Cyan', header: '#00BCD4', cell: '#E0F7FA', text: '#00838F' }
];

/**
 * Get the color scheme for a player based on their index.
 * Cycles through colors if there are more players than colors.
 */
export function getPlayerColor(playerIndex: number) {
	return PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
}



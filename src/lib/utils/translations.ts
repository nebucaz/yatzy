import type { Language } from '../stores/i18nStore';

export interface Translations {
	// Score categories
	ones: string;
	twos: string;
	threes: string;
	fours: string;
	fives: string;
	sixes: string;
	sum: string;
	bonus: string;
	onePair: string;
	twoPairs: string;
	threeOfAKind: string;
	fourOfAKind: string;
	smallStraight: string;
	largeStraight: string;
	fullHouse: string;
	chance: string;
	yatzy: string;

	// UI labels
	total: string;
	category: string;
	date: string;
	time: string;
	rank: string;
	player: string;
	close: string;

	// Buttons
	addPlayer: string;
	clear: string;
	clearValue: string;
	newGame: string;
	clearScoreboard: string;
	clearHistory: string;
	confirm: string;
	skip: string;
	unskip: string;
	cancel: string;
	save: string;
	delete: string;
	removePlayer: string;
	confirmRemove: string;
	deleteHistory: string;

	// Titles
	scoreDashboard: string;
	editPlayerName: string;
	clearScoreDashboard: string;
	deleteGameHistory: string;
	gameHistory: string;
	ranking: string;
	overallRanking: string;
	noGameHistory: string;

	// Labels
	playerName: string;
	enterPlayerName: string;

	// Messages
	clearConfirmation: string;
	newGameConfirmation: string;
	clearScoreboardConfirmation: string;
	clearHistoryConfirmation: string;
	deleteHistoryConfirmation: string;
	removePlayerConfirmation: string;
}

export const translations: Record<Language, Translations> = {
	en: {
		ones: 'Ones',
		twos: 'Twos',
		threes: 'Threes',
		fours: 'Fours',
		fives: 'Fives',
		sixes: 'Sixes',
		sum: 'Sum',
		bonus: 'Bonus',
		onePair: 'One Pair',
		twoPairs: 'Two Pairs',
		threeOfAKind: 'Three of a Kind',
		fourOfAKind: 'Four of a Kind',
		smallStraight: 'Small Straight',
		largeStraight: 'Large Straight',
		fullHouse: 'Full House',
		chance: 'Chance',
		yatzy: 'Yatzy',
		total: 'Total',
		category: 'Category',
		date: 'Date',
		time: 'Time',
		rank: 'Rank',
		player: 'Player',
		close: 'Close',
		addPlayer: '+ Add Player',
		clear: 'Clear',
		clearValue: 'Clear Value',
		newGame: 'New Game',
		clearScoreboard: 'Clear Scoreboard',
		clearHistory: 'Clear History',
		confirm: 'Confirm',
		skip: 'Skip',
		unskip: 'Unskip',
		cancel: 'Cancel',
		save: 'Save',
		delete: 'Delete',
		removePlayer: 'Remove Player',
		confirmRemove: 'Confirm Remove',
		deleteHistory: 'Delete History',
		scoreDashboard: 'Yatzy Score Dashboard',
		editPlayerName: 'Edit Player Name',
		clearScoreDashboard: 'Clear Score Dashboard',
		deleteGameHistory: 'Delete Game History',
		gameHistory: 'Game History',
		ranking: 'Ranking',
		overallRanking: 'Overall Ranking',
		noGameHistory: 'No game history available',
		playerName: 'Player Name:',
		enterPlayerName: 'Enter player name',
		clearConfirmation: 'Are you sure you want to clear all scores? This action cannot be undone.',
		newGameConfirmation: 'Are you sure you want to start a new game? Current scores will be saved to history.',
		clearScoreboardConfirmation: 'Are you sure you want to clear the scoreboard? This will reset to one player and cannot be undone.',
		clearHistoryConfirmation: 'Are you sure you want to clear the game history? This action cannot be undone.',
		deleteHistoryConfirmation: 'Are you sure you want to delete all game history? This action cannot be undone.',
		removePlayerConfirmation: 'Are you sure you want to remove this player? This action cannot be undone.'
	},
	de: {
		ones: 'Einsen',
		twos: 'Zweien',
		threes: 'Dreien',
		fours: 'Vieren',
		fives: 'Fünfen',
		sixes: 'Sechsen',
		sum: 'Summe',
		bonus: 'Bonus',
		onePair: 'Ein Paar',
		twoPairs: 'Zwei Paare',
		threeOfAKind: 'Drei Gleiche',
		fourOfAKind: 'Vier Gleiche',
		smallStraight: 'Kleine Strasse',
		largeStraight: 'Grosse Strasse',
		fullHouse: 'Full House',
		chance: 'Chance',
		yatzy: 'Yatzy',
		total: 'Gesamt',
		category: 'Kategorie',
		date: 'Datum',
		time: 'Uhrzeit',
		rank: 'Rang',
		player: 'Spieler',
		close: 'Schließen',
		addPlayer: '+ Spieler hinzufügen',
		clear: 'Löschen',
		clearValue: 'Wert löschen',
		newGame: 'Neues Spiel',
		clearScoreboard: 'Punkte-Tabelle zurücksetzen',
		clearHistory: 'Verlauf löschen',
		confirm: 'Bestätigen',
		skip: 'Streichen',
		unskip: 'Nicht streichen',
		cancel: 'Abbrechen',
		save: 'Speichern',
		delete: 'Löschen',
		removePlayer: 'Spieler entfernen',
		confirmRemove: 'Entfernen bestätigen',
		deleteHistory: 'Verlauf löschen',
		scoreDashboard: 'Yatzy Punkte-Tabelle',
		editPlayerName: 'Spielername bearbeiten',
		clearScoreDashboard: 'Punkte-Tabelle löschen',
		deleteGameHistory: 'Spielverlauf löschen',
		gameHistory: 'Spielverlauf',
		ranking: 'Rangliste',
		overallRanking: 'Gesamtrangliste',
		noGameHistory: 'Kein Spielverlauf verfügbar',
		playerName: 'Spielername:',
		enterPlayerName: 'Spielername eingeben',
		clearConfirmation: 'Sind Sie sicher, dass Sie alle Punkte löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
		newGameConfirmation: 'Sind Sie sicher, dass Sie ein neues Spiel starten möchten? Die aktuellen Punkte werden im Verlauf gespeichert.',
		clearScoreboardConfirmation: 'Sind Sie sicher, dass Sie die Punkte-Tabelle zurücksetzen möchten? Dies setzt auf einen Spieler zurück und kann nicht rückgängig gemacht werden.',
		clearHistoryConfirmation: 'Sind Sie sicher, dass Sie den Spielverlauf löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
		deleteHistoryConfirmation: 'Sind Sie sicher, dass Sie den gesamten Spielverlauf löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
		removePlayerConfirmation: 'Sind Sie sicher, dass Sie diesen Spieler entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
	},
	ft: {
		ones: 'Unos',
		twos: 'Dos',
		threes: 'Tres',
		fours: 'Cuatros',
		fives: 'Cincos',
		sixes: 'Seises',
		sum: 'Suma',
		bonus: 'Bonus',
		onePair: 'Un Par',
		twoPairs: 'Dos Pares',
		threeOfAKind: 'Tres Iguales',
		fourOfAKind: 'Cuatro Iguales',
		smallStraight: 'Escalera Pequeña',
		largeStraight: 'Escalera Grande',
		fullHouse: 'Full House',
		chance: 'Suerte',
		yatzy: 'Yatzy',
		total: 'Total',
		category: 'Categoría',
		date: 'Fecha',
		time: 'Hora',
		rank: 'Rango',
		player: 'Jugador',
		close: 'Cerrar',
		addPlayer: '+ Añadir Jugador',
		clear: 'Limpiar',
		clearValue: 'Limpiar Valor',
		newGame: 'Nuevo Juego',
		clearScoreboard: 'Limpiar Tablero',
		clearHistory: 'Limpiar Historial',
		confirm: 'Confirmar',
		skip: 'Saltar',
		unskip: 'No Saltar',
		cancel: 'Cancelar',
		save: 'Guardar',
		delete: 'Eliminar',
		removePlayer: 'Eliminar Jugador',
		confirmRemove: 'Confirmar Eliminación',
		deleteHistory: 'Eliminar Historial',
		scoreDashboard: 'Tablero de Puntos Yatzy',
		editPlayerName: 'Editar Nombre del Jugador',
		clearScoreDashboard: 'Limpiar Tablero de Puntos',
		deleteGameHistory: 'Eliminar Historial de Juegos',
		gameHistory: 'Historial de Juegos',
		ranking: 'Clasificación',
		overallRanking: 'Clasificación General',
		noGameHistory: 'No hay historial de juegos disponible',
		playerName: 'Nombre del Jugador:',
		enterPlayerName: 'Ingrese el nombre del jugador',
		clearConfirmation: '¿Está seguro de que desea limpiar todos los puntos? Esta acción no se puede deshacer.',
		newGameConfirmation: '¿Está seguro de que desea iniciar un nuevo juego? Los puntos actuales se guardarán en el historial.',
		clearScoreboardConfirmation: '¿Está seguro de que desea limpiar el tablero? Esto restablecerá a un jugador y no se puede deshacer.',
		clearHistoryConfirmation: '¿Está seguro de que desea limpiar el historial? Esta acción no se puede deshacer.',
		deleteHistoryConfirmation: '¿Está seguro de que desea eliminar todo el historial de juegos? Esta acción no se puede deshacer.',
		removePlayerConfirmation: '¿Está seguro de que desea eliminar este jugador? Esta acción no se puede deshacer.'
	},
	fr: {
		ones: 'Un',
		twos: 'Deux',
		threes: 'Trois',
		fours: 'Quatre',
		fives: 'Cinq',
		sixes: 'Six',
		sum: 'Somme',
		bonus: 'Bonus',
		onePair: 'Une Paire',
		twoPairs: 'Deux Paires',
		threeOfAKind: 'Brelan',
		fourOfAKind: 'Carré',
		smallStraight: 'Petite Suite',
		largeStraight: 'Grande Suite',
		fullHouse: 'Full',
		chance: 'Chance',
		yatzy: 'Yatzy',
		total: 'Total',
		category: 'Catégorie',
		date: 'Date',
		time: 'Heure',
		rank: 'Rang',
		player: 'Joueur',
		close: 'Fermer',
		addPlayer: '+ Ajouter un Joueur',
		clear: 'Effacer',
		clearValue: 'Effacer la Valeur',
		newGame: 'Nouvelle Partie',
		clearScoreboard: 'Réinitialiser le Tableau',
		clearHistory: 'Effacer l\'Historique',
		confirm: 'Confirmer',
		skip: 'Passer',
		unskip: 'Ne Pas Passer',
		cancel: 'Annuler',
		save: 'Enregistrer',
		delete: 'Supprimer',
		removePlayer: 'Retirer le Joueur',
		confirmRemove: 'Confirmer le Retrait',
		deleteHistory: 'Supprimer l\'Historique',
		scoreDashboard: 'Tableau de Scores Yatzy',
		editPlayerName: 'Modifier le Nom du Joueur',
		clearScoreDashboard: 'Effacer le Tableau de Scores',
		deleteGameHistory: 'Supprimer l\'Historique des Parties',
		gameHistory: 'Historique des Parties',
		ranking: 'Classement',
		overallRanking: 'Classement Général',
		noGameHistory: 'Aucun historique de parties disponible',
		playerName: 'Nom du Joueur:',
		enterPlayerName: 'Entrez le nom du joueur',
		clearConfirmation: 'Êtes-vous sûr de vouloir effacer tous les scores? Cette action ne peut pas être annulée.',
		newGameConfirmation: 'Êtes-vous sûr de vouloir commencer une nouvelle partie? Les scores actuels seront enregistrés dans l\'historique.',
		clearScoreboardConfirmation: 'Êtes-vous sûr de vouloir réinitialiser le tableau? Cela reviendra à un joueur et ne peut pas être annulé.',
		clearHistoryConfirmation: 'Êtes-vous sûr de vouloir effacer l\'historique? Cette action ne peut pas être annulée.',
		deleteHistoryConfirmation: 'Êtes-vous sûr de vouloir supprimer tout l\'historique des parties? Cette action ne peut pas être annulée.',
		removePlayerConfirmation: 'Êtes-vous sûr de vouloir retirer ce joueur? Cette action ne peut pas être annulée.'
	},
	it: {
		ones: 'Uno',
		twos: 'Due',
		threes: 'Tre',
		fours: 'Quattro',
		fives: 'Cinque',
		sixes: 'Sei',
		sum: 'Somma',
		bonus: 'Bonus',
		onePair: 'Un Paio',
		twoPairs: 'Due Pari',
		threeOfAKind: 'Tris',
		fourOfAKind: 'Poker',
		smallStraight: 'Scala Piccola',
		largeStraight: 'Scala Grande',
		fullHouse: 'Full House',
		chance: 'Chance',
		yatzy: 'Yatzy',
		total: 'Totale',
		category: 'Categoria',
		date: 'Data',
		time: 'Ora',
		rank: 'Posizione',
		player: 'Giocatore',
		close: 'Chiudi',
		addPlayer: '+ Aggiungi Giocatore',
		clear: 'Cancella',
		clearValue: 'Cancella Valore',
		newGame: 'Nuova Partita',
		clearScoreboard: 'Azzera Tabellone',
		clearHistory: 'Cancella Cronologia',
		confirm: 'Conferma',
		skip: 'Salta',
		unskip: 'Non Saltare',
		cancel: 'Annulla',
		save: 'Salva',
		delete: 'Elimina',
		removePlayer: 'Rimuovi Giocatore',
		confirmRemove: 'Conferma Rimozione',
		deleteHistory: 'Elimina Cronologia',
		scoreDashboard: 'Tabellone Punti Yatzy',
		editPlayerName: 'Modifica Nome Giocatore',
		clearScoreDashboard: 'Cancella Tabellone Punti',
		deleteGameHistory: 'Elimina Cronologia Giochi',
		gameHistory: 'Cronologia Giochi',
		ranking: 'Classifica',
		overallRanking: 'Classifica Generale',
		noGameHistory: 'Nessuna cronologia di giochi disponibile',
		playerName: 'Nome Giocatore:',
		enterPlayerName: 'Inserisci nome giocatore',
		clearConfirmation: 'Sei sicuro di voler cancellare tutti i punti? Questa azione non può essere annullata.',
		newGameConfirmation: 'Sei sicuro di voler iniziare una nuova partita? I punti attuali verranno salvati nella cronologia.',
		clearScoreboardConfirmation: 'Sei sicuro di voler azzerare il tabellone? Questo reimposterà a un giocatore e non può essere annullato.',
		clearHistoryConfirmation: 'Sei sicuro di voler cancellare la cronologia? Questa azione non può essere annullata.',
		deleteHistoryConfirmation: 'Sei sicuro di voler eliminare tutta la cronologia dei giochi? Questa azione non può essere annullata.',
		removePlayerConfirmation: 'Sei sicuro di voler rimuovere questo giocatore? Questa azione non può essere annullata.'
	}
};

export function getTranslation(key: keyof Translations, lang: Language): string {
	return translations[lang][key];
}


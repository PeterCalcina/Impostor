export type Language = 'es' | 'en';

export const translations = {
  es: {
    // Header
    header: {
      subtitle: "No seas sospechoso...",
    },
    // Footer
    footer: {
      madeWith: "Hecho con ❤️ para Magios Deck Society",
      feedback: "¿Tienes ideas? ¡Envíame tu feedback! :D",
    },
    // Quick Guide
    quickGuide: {
      title: "🚀 Guía Rápida para Nuevos Jugadores:",
      step1: "Agrega al menos <b>3 jugadores</b>.",
      step2: "Elige una <b>categoría</b> y pasa el teléfono.",
      step3: "Todos reciben la palabra secreta, <b>¡excepto el Impostor!</b>",
      step4: "¡Encuentra al mentiroso antes de que adivine la palabra!",
    },
    // Game Setup
    gameSetup: {
      addPlayer: "Agregar Jugador",
      playerName: "Nombre del jugador",
      players: "Jugadores",
      selectCategory: "Selecciona una Categoría",
      numberOfImpostors: "Número de Impostores",
      needMorePlayers: "Necesitas al menos 3 jugadores",
      start: "Empezar",
      gameMode: {
        international: "International",
        national: "🇧🇴 Sabor Nacional",
      },
      spicyWarning: {
        title: "⚠️ Advertencia: Contenido Picante",
        message: "Esta categoría contiene palabras con contenido para adultos.",
        description: "Asegúrate de que todos los jugadores estén cómodos con este tipo de contenido antes de continuar.",
        confirm: "Continuar",
        cancel: "Cancelar",
      },
    },
    // Categories
    categories: {
      party: "Fiesta",
      food: "Comida",
      drinks: "Bebidas",
      animals: "Animales",
      sports: "Deportes",
      spicy: "Picante",
      movies: "Películas",
      series: "Series",
      dances: "Bailes danzas",
      generalCulture: "Cultura general",
    },
    // Game Screen
    gameScreen: {
      turnOf: "Turno de",
      viewWord: "Ver Palabra",
      nextPlayer: "Siguiente Jugador",
      player: "Jugador",
      of: "de",
      youAreImpostor: "ERES EL IMPOSTOR",
      playAgain: "Reiniciar Partida",
    },
    // Game Final
    gameFinal: {
      gameFinished: "¡Juego Terminado!",
      secretWordWas: "La palabra secreta era",
      impostorWas: "El impostor era",
      impostorsWere: "Los impostores eran",
      revealWord: "Revelar Palabra",
      playAgain: "Jugar de Nuevo",
      wantToReveal: "¿Quieres revelar la palabra secreta?",
    },
    // Game App
    gameApp: {
      selectCategory: "Por favor selecciona una categoría",
      categoriesError: "Error: No se cargaron las categorías correctamente",
      categoryWordsError: "Error: No se encontraron palabras para la categoría",
    },
  },
  en: {
    // Header
    header: {
      subtitle: "Don't be sus...",
    },
    // Footer
    footer: {
      madeWith: "Made with ❤️ for Magios Deck Society",
      feedback: "Got ideas? Send me your feedback! :D",
    },
    // Quick Guide
    quickGuide: {
      title: "🚀 Quick Guide for New Players:",
      step1: "Add at least <b>3 players</b>.",
      step2: "Pick a <b>category</b> and pass the phone around.",
      step3: "Everyone gets the secret word, <b>except the Impostor!</b>",
      step4: "Find the liar before they guess the word!",
    },
    // Game Setup
    gameSetup: {
      addPlayer: "Add Player",
      playerName: "Player name",
      players: "Players",
      selectCategory: "Select a Category",
      numberOfImpostors: "Number of Impostors",
      needMorePlayers: "You need at least 3 players",
      start: "Start",
      gameMode: {
        international: "International",
        national: "🇧🇴 National Flavor",
      },
      spicyWarning: {
        title: "⚠️ Warning: Spicy Content",
        message: "This category contains words with adult content.",
        description: "Make sure all players are comfortable with this type of content before continuing.",
        confirm: "Continue",
        cancel: "Cancel",
      },
    },
    // Categories
    categories: {
      party: "Party",
      food: "Food",
      drinks: "Drinks",
      animals: "Animals",
      sports: "Sports",
      spicy: "Spicy",
      movies: "Movies",
      series: "Series",
      dances: "Dances",
      generalCulture: "General Culture",
    },
    // Game Screen
    gameScreen: {
      turnOf: "Turn of",
      viewWord: "View Word",
      nextPlayer: "Next Player",
      player: "Player",
      of: "of",
      youAreImpostor: "YOU ARE THE IMPOSTOR",
      playAgain: "Play Again",
    },
    // Game Final
    gameFinal: {
      gameFinished: "Game Finished!",
      secretWordWas: "The secret word was",
      impostorWas: "The impostor was",
      impostorsWere: "The impostors were",
      revealWord: "Reveal Word",
      playAgain: "Play Again",
      wantToReveal: "Do you want to reveal the secret word?",
    },
    // Game App
    gameApp: {
      selectCategory: "Please select a category",
      categoriesError: "Error: Categories were not loaded correctly",
      categoryWordsError: "Error: No words found for category",
    },
  },
};

export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'es';
  const stored = localStorage.getItem('language');
  if (stored === 'es' || stored === 'en') return stored;
  const browserLang = navigator.language || (navigator as any).userLanguage;
  return browserLang.startsWith('es') ? 'es' : 'en';
}

export function getTranslations(lang: Language = getLanguage()) {
  return translations[lang];
}

export function t(key: string, lang: Language = getLanguage()): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}


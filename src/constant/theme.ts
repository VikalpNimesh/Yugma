export const THEME = {
  colors: {
    // Deep royal wine gradients
    bgGradient: ['#22020B', '#3E0616', '#630D25', '#801231'],
    bgGradientAlt: ['#1C0208', '#320512', '#4D081B'],
    
    // Primary action button gradient
    primaryGradient: ['#FF2D60', '#D8114C', '#940B32'],
    primaryGradientSubtle: ['#E63956', '#C2185B'],
    
    // Card overlays & glassmorphism
    cardBg: 'rgba(255, 255, 255, 0.07)',
    cardBgPressed: 'rgba(255, 255, 255, 0.12)',
    cardBorder: 'rgba(255, 255, 255, 0.14)',
    cardBorderActive: 'rgba(255, 107, 138, 0.5)',
    
    // Input styling
    inputBg: 'rgba(255, 255, 255, 0.06)',
    inputBorder: 'rgba(255, 255, 255, 0.16)',
    inputBorderFocused: '#FF3366',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#F3D7E0',
    textMuted: '#B08092',
    textPlaceholder: '#825667',
    
    // Accents & Badges
    gold: '#F5C518',
    goldGlow: 'rgba(245, 197, 24, 0.35)',
    verifiedBlue: '#3897F0',
    likeGreen: '#4CD964',
    dislikeRed: '#FF3B30',
    superlikeStar: '#00C7FF',
    badgeBg: 'rgba(255, 255, 255, 0.15)',
    divider: 'rgba(255, 255, 255, 0.12)',
    
    // Tab bar
    tabBarBg: '#21020A',
    tabBarBorder: 'rgba(255, 255, 255, 0.08)',
    tabActive: '#FF3366',
    tabInactive: '#966D7D',
  },
  typography: {
    fontFamilyHeading: 'System',
    fontFamilyBody: 'System',
  },
  shadows: {
    glow: {
      shadowColor: '#FF2D60',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 10,
      elevation: 8,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export default THEME;

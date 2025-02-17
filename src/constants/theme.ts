export const theme = {
  colors: {
    // Primary colors
    primary: '#00A8E1', // Prime Video Blue
    secondary: '#FFFFFF',
    
    // Background colors
    background: {
      primary: '#0F171E', // Dark blue-black
      secondary: '#1A242F', // Slightly lighter blue-black
      card: '#1B2530', // Card background
      overlay: 'rgba(15, 23, 30, 0.9)' // Overlay with blue tint
    },
    
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#8197A4', // Prime's secondary text
      tertiary: '#637A87' // Prime's tertiary text
    },

    // Status colors
    success: '#3EB489', // Softer green
    error: '#FF6B6B', // Soft red
    warning: '#FFC107', // Amber
    
    // Prime specific colors
    accent: {
      blue: '#00A8E1', // Primary blue
      lightBlue: '#69C9E5', // Lighter blue for hover
      darkBlue: '#0084B4', // Darker blue for active states
      gold: '#FBB829' // Prime gold for special elements
    }
  },

  // Typography
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System'
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30
    }
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40
  },

  // Border Radius
  borderRadius: {
    sm: 2, // Prime uses smaller radius
    md: 4,
    lg: 6,
    xl: 8
  },

  // Shadows
  shadows: {
    card: '0px 2px 10px rgba(0, 0, 0, 0.3)',
    modal: '0px 4px 20px rgba(0, 0, 0, 0.5)'
  },

  // Animation
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)'
    }
  }
}; 
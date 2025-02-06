export const theme = {
  colors: {
    // Primary colors
    primary: '#E50914', // Netflix Red
    secondary: '#FFFFFF',
    
    // Background colors
    background: {
      primary: '#000000',
      secondary: '#141414',
      card: '#181818',
      overlay: 'rgba(0, 0, 0, 0.7)'
    },
    
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#E5E5E5',
      tertiary: '#6E6E6E'
    },

    // Status colors
    success: '#46D369',
    error: '#E50914',
    warning: '#F5B014'
  },

  // Typography
  typography: {
    fontFamily: {
      regular: 'NetflixSans-Regular',
      medium: 'NetflixSans-Medium',
      bold: 'NetflixSans-Bold'
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
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16
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
export const oldTheme = {
  name: 'my-theme',
  tokens: {
    fonts: {
      default: {
        static: {
          value: '"Roboto", sans-serif',
        },
        variable: {
          value: '"Roboto", sans-serif',
        },
      },
    },
    colors: {
      font: {
        primary: '#000',
      },
      brand: {
        primary: {
          10: { value: 'rgba(81,120,194,.1)' },
          20: { value: 'rgba(81,120,194,.2)' },
          40: { value: 'rgba(81,120,194,.4)' },
          60: { value: 'rgba(81,120,194,.6)' },
          80: { value: 'rgba(81,120,194,1)' },
          90: { value: 'rgba(81,120,194,.9)' },
          100: { value: 'rgba(81,120,194,1)' },
        },
        secondary: {
          10: { value: 'rgba(240,207,96,.1)' },
          20: { value: 'rgba(240,207,96,.2)' },
          40: { value: 'rgba(240,207,96,.4)' },
          60: { value: 'rgba(240,207,96,.6)' },
          80: { value: 'rgba(240,207,96,.8)' },
          90: { value: 'rgba(240,207,96,.9)' },
          100: { value: 'rgba(240,207,96,1)' },
        },
      },
    },
  },
};

export const newTheme = {
  name: 'my-new-theme',
  tokens: {
    fonts: {
      default: {
        static: {
          value: '"Roboto", sans-serif',
        },
        variable: {
          value: '"Roboto", sans-serif',
        },
      },
    },
    colors: {
      font: {
        primary: '#000',
      },
      brand: {
        primary: {
          value: '#5178C2',
          light: { value: '#E6E6FA' },
        },
        secondary: {
          value: '#F6CE46',
        },
      },
    },
  },
};

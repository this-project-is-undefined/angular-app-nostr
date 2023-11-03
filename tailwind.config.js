/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    boxShadow: {
      none: '0 0px 0px 1px rgba(0, 0, 0, 0.20)',
      skim: '0px 1px 4px 0px rgba(0, 0, 0, 0.20)',
      light: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)',
      lifted: '0px 4px 16px 0px rgba(0, 0, 0, 0.20)',
      raised: '0px 6px 24px 0px rgba(0, 0, 0, 0.20)',
      floating: '0px 8px 32px 0px rgba(0, 0, 0, 0.20)',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A76B',
          50: '#E8F6EE',
          100: '#B2E5D4',
          200: '#7FD5BA',
          300: '#4DC49F',
          400: '#1AB485',
          500: '#00A76B',
          600: '#009D63',
          700: '#009359',
          800: '#008951',
          900: '#007F48',
          950: '#006D3B',
        },
        secondary: {
          DEFAULT: '#3F51B5',
          50: '#E8EAF6',
          100: '#C5CAE9',
          200: '#9FA8DA',
          300: '#7986CB',
          400: '#5C6BC0',
          500: '#3F51B5',
          600: '#3949AB',
          700: '#303F9F',
          800: '#283593',
          900: '#1A237E',
          950: '#0D1C66',
        },
        tertiary: {
          DEFAULT: '#FF9800',
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
          950: '#D84315',
        },
        gray: {
          100: '#F8F9FA',
          200: '#F1F3F5',
          300: '#E9ECEF',
          400: '#DEE2E6',
          500: '#CED4DA',
          600: '#ADB5BD',
          700: '#868E96',
          800: '#495057',
          900: '#343A40',
          950: '#0B0D0E',
        },
        black: {
          DEFAULT: '#0B0D0E',
        },
        white: {
          DEFAULT: '#FEFEFE',
        },
        success: {
          DEFAULT: '#53D258',
          100: '#DDF6DE',
          200: '#BAEDBC',
          300: '#98E49B',
          400: '#75DB79',
          500: '#53D258',
        },
        alert: {
          DEFAULT: '#E4C65B',
          100: '#FAF4DE',
          200: '#F4E8BD',
          300: '#EFDD9D',
          400: '#E9D17C',
          500: '#E4C65B',
        },
        error: {
          DEFAULT: '#E25C5C',
          100: '#F9DEDE',
          200: '#F3BEBE',
          300: '#EE9D9D',
          400: '#E87D7D',
          500: '#E25C5C',
        },
        info: {
          DEFAULT: '#2685CA',
          100: '#D4E7F4',
          200: '#A8CEEA',
          300: '#7DB6DF',
          400: '#519DD5',
          500: '#2685CA',
        },
        back: '#0D030E',
        purpleBox: '#1D081F',
        whiteLetter: '#FAFCFC',
        grayLetter: '#A8A8A8',
        purpleAccent: '#70257A',
        purpleSecondary: '##edd8f1',
      },
    },
  },
  plugins: [],
};

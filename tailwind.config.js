/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#008AA1',
        secondary: '#03D6CA',
        background: '#F2F6FF',
        white: '#ffffff',
        'primary-dark': '#016070'
      },
      fontFamily: {
        robotoregular: ['RobotoRegular'],
        robotobold: ['RobotoBold'],
        robotomedium: ['RobotoMedium'],
      }
    }
  },
  plugins: [],
}
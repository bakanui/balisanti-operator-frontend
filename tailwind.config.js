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
        primary: '#FF4D4D', // Bright red
        secondary: '#FF6666', // Light red
        background: '#FFF5F5', // Very light red
        white: '#ffffff', // Unchanged
        'primary-dark': '#A10000' // Dark red
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
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'demargo-orange': '#ff7a00',
        'demargo-black': '#000000',
        'demargo-blue': '#000000' // mapped to black for complete orange & black theme
      }
    }
  },
  plugins: [],
}

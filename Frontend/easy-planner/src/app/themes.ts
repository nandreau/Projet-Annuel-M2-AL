import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const CustomAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e0efff',
      100: '#b3d9ff',
      200: '#80c2ff',
      300: '#4daaff',
      400: '#1a93ff',
      500: '#2563eb' /* primary */,
      600: '#1d4ed8' /* hover */,
      700: '#1e40af' /* active */,
      800: '#172a8a',
      900: '#0f1d66',
    },
  },
});

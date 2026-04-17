import '@mantine/core/styles.css';
import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { MantineProvider, createTheme } from '@mantine/core';

// Brand palette matching the vivid blue from the design (#3b3bff ≈ index 5)
const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#eeeeff', '#d0d0ff', '#b0b0ff', '#8f8fff', '#6868ff',
      '#3b3bff', '#3333e0', '#2b2bc4', '#2323a8', '#1b1b8c',
    ],
  },
  fontFamily: "'Eudoxus Sans', system-ui, sans-serif",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}

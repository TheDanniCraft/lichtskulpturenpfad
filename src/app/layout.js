import "./globals.css";
import '@mantine/core/styles.css';

import { ColorSchemeScript } from '@mantine/core';
import Theme from "./Theme";

export const metadata = {
  title: "Lichtskulpturenpfad",
  description: "Made by TheDanniCraft",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}

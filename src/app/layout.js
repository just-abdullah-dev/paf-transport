import { poppins } from "./font";
import "./globals.css";


export const metadata = {
  title: "PAF Transport System",
  description: "PAF Transport System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} `}
      >
        {children}
      </body>
    </html>
  );
}

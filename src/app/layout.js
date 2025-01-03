import importModels from "@/models";
import { poppins } from "./font";
import "./globals.css";
import { Toast } from "@/components/utils/Toast";
import StoreProvider from "./StoreProvider";

export const metadata = {
  title: "PAF Transport System",
  description: "PAF Transport System",
};

importModels();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} `}>
        <StoreProvider>
          <Toast />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

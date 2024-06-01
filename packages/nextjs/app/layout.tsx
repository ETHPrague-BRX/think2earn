import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Think2Earn",
  description: "Built with 🏗 Scaffold-ETH 2",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="w-[100vw] overflow-x-hidden">
        <video className="fixed absolute z-0 top-[0px] left-0 scale-150 overflow-x-hidden" autoPlay muted loop>
          <source src="/animation.mp4" type="video/mp4"></source>
        </video>
        <div className="bg-[#000000a3]">
          <ThemeProvider enableSystem>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;

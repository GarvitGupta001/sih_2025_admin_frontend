import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import GoogleTranslateClient from "@/components/dashboard/GoogleTranslateClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AlumniConnect Admin",
  description: "Admin portal for managing alumni and student connections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Hidden Google Translate container */}
        <div id="google_translate_element" style={{ display: "none" }}></div>

        {/* Re-trigger translation on route change */}
        <GoogleTranslateClient />

        {children}
        <Toaster />

        {/* Google Translate Initialization Script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  {
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,pa',
                    autoDisplay: false
                  },
                  'google_translate_element'
                );
                
                // Hide Google Translate banner after initialization
                setTimeout(hideGoogleTranslateBar, 100);
                setTimeout(hideGoogleTranslateBar, 500);
                setTimeout(hideGoogleTranslateBar, 1000);
                setTimeout(hideGoogleTranslateBar, 2000);
              }
              
              function hideGoogleTranslateBar() {
                // Remove the banner iframe
                var frames = document.querySelectorAll('.goog-te-banner-frame, iframe.goog-te-banner-frame');
                frames.forEach(function(frame) {
                  frame.style.display = 'none';
                  frame.style.visibility = 'hidden';
                  frame.style.height = '0';
                  frame.remove();
                });
                
                // Remove skiptranslate elements (but keep our translate element)
                var skipElements = document.querySelectorAll('.skiptranslate');
                skipElements.forEach(function(el) {
                  if (el.id !== 'google_translate_element' && !el.querySelector('#google_translate_element')) {
                    el.style.display = 'none';
                    el.style.height = '0';
                  }
                });
                
                // Reset body position (Google Translate pushes it down)
                document.body.style.top = '0px';
                document.body.style.position = 'static';
                
                // Also check for the newer Google Translate UI classes
                var newBanners = document.querySelectorAll('[class*="VIpgJd"], .goog-te-menu-frame, #goog-gt-tt');
                newBanners.forEach(function(el) {
                  el.style.display = 'none';
                });
              }
              
              // Delay observer setup to avoid hydration issues
              window.addEventListener('load', function() {
                hideGoogleTranslateBar();
                
                // Observe DOM for dynamically added banners
                if (typeof MutationObserver !== 'undefined') {
                  var observer = new MutationObserver(function(mutations) {
                    hideGoogleTranslateBar();
                  });
                  observer.observe(document.body, { childList: true, subtree: true });
                }
              });
            `,
          }}
        />

        {/* Google Translate External Script */}
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
      </body>
    </html>
  );
}

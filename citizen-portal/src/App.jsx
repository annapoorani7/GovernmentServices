import { BrowserRouter } from "react-router-dom";
import Header from "./components/common/Header.jsx";
import Footer from "./components/common/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div className="app">
          <Header />
          <main className="app-main" id="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

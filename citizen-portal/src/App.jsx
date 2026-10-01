import { BrowserRouter } from "react-router-dom";
import Header from "./components/common/Header.jsx";
import Footer from "./components/common/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";
import { useLanguage } from "./i18n/LanguageContext.jsx";

function SkipLink() {
  const { t } = useLanguage();
  return <a href="#main-content" className="skip-link">{t("a11y.skipToMain")}</a>;
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <SkipLink />
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

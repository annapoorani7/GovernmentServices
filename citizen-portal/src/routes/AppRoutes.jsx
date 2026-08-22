import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Services from "../pages/Services.jsx";
import ServiceDetails from "../pages/ServiceDetails.jsx";
import NotFound from "../pages/NotFound.jsx";
import AIAssistant from "../pages/AIAssistant.jsx";
import Eligibility from "../pages/Eligibility.jsx";
import LifeEvents from "../pages/LifeEvents.jsx";
import ScamShield from "../pages/ScamShield.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/eligibility" element={<Eligibility />} />
      <Route path="/life-events" element={<LifeEvents />} />
      <Route path="/scam-shield" element={<ScamShield />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

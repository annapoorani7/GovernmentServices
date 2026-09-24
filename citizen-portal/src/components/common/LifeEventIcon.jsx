export default function LifeEventIcon({ eventId }) {
  const id = eventId?.toLowerCase() || "";

  const iconPath =
    id === "newborn"
      // baby
      ? <><circle cx="12" cy="7" r="3" /><path d="M6 10c-1 1-1.5 2.5-1.5 4 0 2 1.5 3 3 3 1 0 1.5-.5 2-.8M18 10c1 1 1.5 2.5 1.5 4 0 2-1.5 3-3 3-1 0-1.5-.5-2-.8M12 10v8M10 18h4M8 15l-2 4h12l-2-4" /></>
    : id === "student"
      // graduation cap
      ? <><path d="M12 4 2 9l10 5 10-5-10-5Z" /><path d="M6 11v4c0 1.3 2.7 2.5 6 2.5s6-1.2 6-2.5v-4M22 9v5" /></>
    : id === "job"
      // briefcase / work
      ? <><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></>
    : id === "business"
      // shop / storefront
      ? <><path d="M3 9h18M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M9 13h6M9 17h6M8 9l-1-3h10l-1 3" /><path d="M10 5h4" /></>
    : id === "vehicle"
      // car / vehicle
      ? <><path d="M5 16h14l-1-6a2 2 0 0 0-2-1H8a2 2 0 0 0-2 1l-1 6Z" /><path d="M4 16v2h2v-2M18 16v2h2v-2M7 13h10" /><circle cx="8" cy="13" r="1" /><circle cx="16" cy="13" r="1" /></>
    : id === "travel"
      // airplane / travel
      ? <><path d="M12 2 4 9h4l3 8 3-8h4l-8-7Z" /><path d="M4 10h16" /><path d="M7 14h10" /></>
    : id === "retirement"
      // person / aged
      ? <><circle cx="12" cy="7" r="3" /><path d="M8 12h8c1.1 0 2 .9 2 2v5H6v-5c0-1.1.9-2 2-2Z" /><path d="M8 17v3M16 17v3" /></>
    : id === "farmer"
      // wheat / farming
      ? <><path d="M5 20h14M7 14 5 20M12 10 10 20M17 14l2 6M9 12 7 20M15 12l2 8M12 4l-2 8h4l-2-8Z" /><path d="M10 4l1 3M12 4l1 3M14 4l1 3" /></>
    // fallback: generic circle
    : <><circle cx="12" cy="12" r="8" /></>;

  return (
    <svg 
      className="life-event-icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      aria-hidden="true"
    >
      {iconPath}
    </svg>
  );
}

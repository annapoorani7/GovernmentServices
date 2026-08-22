import ServiceCard from "./ServiceCard.jsx";
import Loading from "../common/Loading.jsx";
import EmptyState from "../common/EmptyState.jsx";

export default function ServiceList({ services, loading }) {
  if (loading) {
    return <Loading count={6} />;
  }

  if (!services || !services.length) {
    return <EmptyState />;
  }

  return (
    <div className="grid">
      {services.map((s) => (
        <ServiceCard key={s._id} service={s} />
      ))}
    </div>
  );
}

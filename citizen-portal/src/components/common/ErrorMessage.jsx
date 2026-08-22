export default function ErrorMessage({ message = "Unable to load data. Please try again." }) {
  if (!message) return null;
  return <div className="error" role="alert">⚠️ {message}</div>;
}

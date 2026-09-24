import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function ServiceMetadata({ service }) {
  const { t, localize } = useLanguage();

  const docs = localize(service, "requiredDocuments");
  const documentsValue =
    Array.isArray(docs) && docs.length > 0
      ? docs.slice(0, 3).join(", ")
      : t("meta.documentsValue");

  const metadata = [
    [t("meta.processingTime"), service?.processingTime || t("meta.processingTimeValue")],
    [t("meta.fees"), service?.fees || service?.fee || t("meta.feesValue")],
    [t("meta.documents"), documentsValue],
    [t("meta.delivery"), service?.deliveryMode || service?.delivery || t("meta.deliveryValue")],
  ];

  return (
    <dl className="service-metadata" aria-label={t("meta.processingTime")}>
      {metadata.map(([label, value]) => (
        <div className="service-metadata-item" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

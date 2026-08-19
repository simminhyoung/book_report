export default function Cover({ src, alt, size = "md" }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ""} className={`cover ${size}`} style={{ objectFit: "cover" }} />;
  }
  return <div className={`cover ${size}`} />;
}

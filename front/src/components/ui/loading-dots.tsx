export default function LoadingDots() {
  return (
    <span className="inline-flex">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce [animation-delay:0.2s]">.</span>
      <span className="animate-bounce [animation-delay:0.4s]">.</span>
    </span>
  );
}
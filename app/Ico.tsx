export default function Ico({ d }: { d: string }) {
  return (
    <span className="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
  );
}

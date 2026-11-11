import { waLink } from "../lib/config";

const Icon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.300.7-1.900.9-2.200.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.200.1.400 0 .5l-.4.600-.3.300c-.1.100-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.300 2.400 1.500.3.100.5.100.6-.1l.8-1c.2-.2.4-.2.600-.1l1.900.9c.2.100.4.200.4.300.1.200.1.800-.1 1.400z" /></svg>
);

export function WhatsAppButton({ message, label = "Contacter YUM sur WhatsApp", className = "btn wa" }: { message: string; label?: string; className?: string }) {
  return <a className={className} href={waLink(message)} target="_blank" rel="noreferrer"><Icon />{label}</a>;
}

export function WhatsAppFloat({ message }: { message: string }) {
  return <a className="wa-float" href={waLink(message)} target="_blank" rel="noreferrer" aria-label="Écrire à YUM sur WhatsApp"><Icon /><span>WhatsApp</span></a>;
}

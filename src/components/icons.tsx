import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ReactMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="2.6" fill="currentColor" />
      <ellipse cx="16" cy="16" rx="13" ry="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <ellipse cx="16" cy="16" rx="13" ry="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="13" ry="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" transform="rotate(120 16 16)" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return <svg viewBox="0 0 16 16" aria-hidden="true" {...props}><path d="m4 6 4 4 4-4" /></svg>;
}

export function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 7c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" {...props}><path d="M16.2 6.2A7 7 0 1 0 17 12h-2a5 5 0 1 1-.7-2.5L11.8 12H18V5.8l-1.8 1.8V6.2Z" /></svg>;
}

export function PlayIcon(props: IconProps) {
  return <svg viewBox="0 0 18 18" aria-hidden="true" {...props}><path d="m6 4 8 5-8 5z" /></svg>;
}

export function FolderIcon(props: IconProps) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" {...props}><path d="M2.5 5h5l1.6 2h8.4v8.5h-15z" /></svg>;
}

export function TreeChevron(props: IconProps) {
  return <svg viewBox="0 0 16 16" aria-hidden="true" {...props}><path d="m5 3 5 5-5 5" /></svg>;
}

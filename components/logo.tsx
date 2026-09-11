interface LogoProps {
  inverse?: boolean;
}

export function Logo({ inverse = false }: LogoProps) {
  return (
    <span className={`brand ${inverse ? "brand--inverse" : ""}`}>
      <svg
        className="brand__mark"
        viewBox="0 0 42 42"
        aria-hidden="true"
      >
        <path
          d="M8 7.5h20.5c3.9 0 6.8 3.2 6.1 7L32 29.7a6 6 0 0 1-5.9 5H5.5l2.2-7.4h16.9l.8-4.3H13.8c-4.2 0-7.1-3.8-5.9-7.8L8 14.8h19.6l.8-4.2H7.1L8 7.5Z"
          fill="currentColor"
        />
        <path d="m29.5 18 8.5 3-9.6 3.1 1.1-6.1Z" fill="var(--brand-accent)" />
      </svg>
      <span className="brand__wordmark">
        Swift<span>Xpress</span>
      </span>
    </span>
  );
}

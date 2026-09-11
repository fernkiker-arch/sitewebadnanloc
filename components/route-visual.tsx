interface RouteVisualCopy {
  eyebrow: string;
  title: string;
  pickup: string;
  transit: string;
  delivery: string;
  area: string;
}

export function RouteVisual({ copy }: { copy: RouteVisualCopy }) {
  return (
    <div className="route-card">
      <div className="route-card__heading">
        <div>
          <span className="eyebrow eyebrow--light">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
        </div>
        <span className="route-card__signal" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="route-map" aria-hidden="true">
        <svg viewBox="0 0 620 360" role="presentation">
          <path className="map-street map-street--one" d="M-20 95 655 310" />
          <path className="map-street map-street--two" d="M100-10 250 390" />
          <path className="map-street map-street--three" d="M440-15 335 390" />
          <path className="map-street map-street--four" d="M-20 280 630 70" />
          <path
            className="route-line route-line--shadow"
            d="M95 260c60-10 70-120 157-114 69 5 63 97 140 91 54-4 52-87 126-106"
          />
          <path
            className="route-line"
            d="M95 260c60-10 70-120 157-114 69 5 63 97 140 91 54-4 52-87 126-106"
          />
          <circle className="route-point route-point--start" cx="95" cy="260" r="13" />
          <circle className="route-point route-point--end" cx="518" cy="131" r="13" />
          <g className="route-van" transform="translate(307 202)">
            <circle cx="0" cy="0" r="28" />
            <path d="M-14-7h15v14h-15zM1-3h7l7 7v3H1z" />
            <circle cx="-7" cy="10" r="3" />
            <circle cx="10" cy="10" r="3" />
          </g>
        </svg>
      </div>

      <div className="route-steps">
        <div>
          <span>01</span>
          <strong>{copy.pickup}</strong>
        </div>
        <div className="route-steps__active">
          <span>02</span>
          <strong>{copy.transit}</strong>
        </div>
        <div>
          <span>03</span>
          <strong>{copy.delivery}</strong>
        </div>
      </div>
      <p className="route-card__area">
        <span aria-hidden="true">●</span>
        {copy.area}
      </p>
    </div>
  );
}

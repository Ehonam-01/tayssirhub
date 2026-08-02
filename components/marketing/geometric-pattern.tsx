// Motif géométrique islamique discret (deux carrés superposés à 45° = étoile
// à 8 branches), en SVG répété — pas de photo, cohérent avec la charte
// "premium sans religieux excessif" demandée.
export function GeometricPattern({ className, id = "tayssir-geo" }: { className?: string; id?: string }) {
  return (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} width="64" height="64" patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <rect x="12" y="12" width="40" height="40" transform="rotate(45 32 32)" />
            <rect x="12" y="12" width="40" height="40" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

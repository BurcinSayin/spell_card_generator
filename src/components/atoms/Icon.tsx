interface Props {
  name:
    | 'search'
    | 'x'
    | 'plus'
    | 'minus'
    | 'check'
    | 'grip'
    | 'pdf'
    | 'sliders'
    | 'filter'
    | 'list'
    | 'chevron'
    | 'trash';
  size?: number;
}

export function Icon({ name, size = 16 }: Props): JSX.Element | null {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'search':
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
      );
    case 'x':
      return (
        <svg {...p}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...p}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'minus':
      return (
        <svg {...p}>
          <path d="M5 12h14" />
        </svg>
      );
    case 'check':
      return (
        <svg {...p}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'grip':
      return (
        <svg {...p}>
          <circle cx="9" cy="6" r="1.2" />
          <circle cx="9" cy="12" r="1.2" />
          <circle cx="9" cy="18" r="1.2" />
          <circle cx="15" cy="6" r="1.2" />
          <circle cx="15" cy="12" r="1.2" />
          <circle cx="15" cy="18" r="1.2" />
        </svg>
      );
    case 'pdf':
      return (
        <svg {...p}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 14h6M9 17h4" />
        </svg>
      );
    case 'sliders':
      return (
        <svg {...p}>
          <path d="M4 7h10M18 7h2" />
          <circle cx="16" cy="7" r="2" />
          <path d="M4 17h2M10 17h10" />
          <circle cx="8" cy="17" r="2" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...p}>
          <path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
        </svg>
      );
    case 'list':
      return (
        <svg {...p}>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
          <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'chevron':
      return (
        <svg {...p}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...p}>
          <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" />
        </svg>
      );
  }
}

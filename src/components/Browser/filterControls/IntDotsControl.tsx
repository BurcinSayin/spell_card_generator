import type { FilterControl } from '../../../systems/types';
import { LevelDot } from '../../atoms/LevelDot';
import { Section } from '../../atoms/Section';

type IntDotsCtrl = Extract<FilterControl, { kind: 'int-dots' }>;

interface Props {
  control: IntDotsCtrl;
  value: number[];
  onChange: (v: number[]) => void;
}

function toggleArr<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function IntDotsControl({
  control,
  value,
  onChange,
}: Props): JSX.Element {
  return (
    <Section
      label={control.label}
      hint={value.length ? `${value.length} of ${control.values.length}` : 'any'}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 5,
          justifyContent: 'space-between',
        }}
      >
        {control.values.map((n) => (
          <LevelDot
            key={n}
            n={n}
            on={value.includes(n)}
            onClick={() => onChange(toggleArr(value, n))}
          />
        ))}
      </div>
    </Section>
  );
}

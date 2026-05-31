import type { FilterControl } from '../../../systems/types';
import { EnumTile } from '../../atoms/EnumTile';
import { Section } from '../../atoms/Section';

type EnumGridCtrl = Extract<FilterControl, { kind: 'enum-grid' }>;

interface Props {
  control: EnumGridCtrl;
  value: string[];
  counts: Record<string, number>;
  onChange: (v: string[]) => void;
}

function toggleArr<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function EnumGridControl({
  control,
  value,
  counts,
  onChange,
}: Props): JSX.Element {
  return (
    <Section
      label={control.label}
      hint={
        value.length
          ? `${value.length}/${control.options.length}`
          : 'all'
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${control.columns},1fr)`,
          gap: 6,
        }}
      >
        {control.options.map((opt) => (
          <EnumTile
            key={opt.value}
            label={opt.label}
            short={opt.short}
            color={opt.color}
            on={value.includes(opt.value)}
            count={counts[opt.value] ?? 0}
            onClick={() => onChange(toggleArr(value, opt.value))}
            showColors={control.showColors}
          />
        ))}
      </div>
    </Section>
  );
}

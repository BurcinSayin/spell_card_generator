import type { FilterControl } from '../../../systems/types';
import { Pill } from '../../atoms/Pill';
import { Section } from '../../atoms/Section';

type EnumPillsCtrl = Extract<FilterControl, { kind: 'enum-pills' }>;

interface Props {
  control: EnumPillsCtrl;
  value: string[];
  onChange: (v: string[]) => void;
}

function toggleArr<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function EnumPillsControl({
  control,
  value,
  onChange,
}: Props): JSX.Element {
  return (
    <Section
      label={control.label}
      hint={
        value.length ? `${value.length}/${control.options.length}` : 'any'
      }
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {control.options.map((opt) => (
          <Pill
            key={opt.value}
            on={value.includes(opt.value)}
            onClick={() => onChange(toggleArr(value, opt.value))}
            style={{ padding: '3px 8px', fontSize: 11 }}
          >
            {opt.label}
          </Pill>
        ))}
      </div>
    </Section>
  );
}

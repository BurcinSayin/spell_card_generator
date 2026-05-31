import type { FilterControl } from '../../../systems/types';
import { LevelDot } from '../../atoms/LevelDot';
import { Pill } from '../../atoms/Pill';
import { Section } from '../../atoms/Section';

type ClassLevelCtrl = Extract<FilterControl, { kind: 'class-level' }>;

interface Props {
  control: ClassLevelCtrl;
  classesValue: string[];
  classesOnChange: (v: string[]) => void;
  levelsValue: number[];
  levelsOnChange: (v: number[]) => void;
}

function toggleArr<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function ClassLevelControl({
  control,
  classesValue,
  classesOnChange,
  levelsValue,
  levelsOnChange,
}: Props): JSX.Element {
  return (
    <>
      <Section
        label={control.levels.label}
        hint={
          levelsValue.length
            ? `${levelsValue.length} of ${control.levels.values.length}`
            : 'any'
        }
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 5,
            justifyContent: 'space-between',
          }}
        >
          {control.levels.values.map((n) => (
            <LevelDot
              key={n}
              n={n}
              on={levelsValue.includes(n)}
              onClick={() => levelsOnChange(toggleArr(levelsValue, n))}
            />
          ))}
        </div>
      </Section>

      <Section
        label={control.classes.label}
        hint={
          classesValue.length
            ? `${classesValue.length}/${control.classes.options.length}`
            : 'any'
        }
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {control.classes.options.map((opt) => (
            <Pill
              key={opt.value}
              on={classesValue.includes(opt.value)}
              onClick={() => classesOnChange(toggleArr(classesValue, opt.value))}
              style={{ padding: '3px 8px', fontSize: 11 }}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </Section>
    </>
  );
}

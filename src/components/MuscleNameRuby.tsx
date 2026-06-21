type MuscleNameRubyProps = {
  name: string;
  reading: string;
  className?: string;
};

export function MuscleNameRuby({ name, reading, className }: MuscleNameRubyProps) {
  return (
    <ruby className={className}>
      {name}
      <rt>{reading}</rt>
    </ruby>
  );
}

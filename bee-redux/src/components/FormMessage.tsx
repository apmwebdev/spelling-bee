export function FormMessage({
  value,
  classes,
}: {
  value: string;
  classes: string;
}) {
  return <div className={classes}>{value}</div>;
}

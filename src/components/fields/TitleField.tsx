
export function TitleField (props: { label: string, isSkeleton?: boolean }) {
  return props.isSkeleton ? (
    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
  ) : (
    <div className="h-6">{props.label}</div>
  );
}

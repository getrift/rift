export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 shadow-sm">
      {props.children}
    </div>
  )
}


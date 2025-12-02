export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="inline-flex items-center justify-center bg-accent hover:bg-accent/80 text-white text-sm px-3 py-2 rounded-md"
      {...props}
    />
  )
}

export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="inline-flex items-center justify-center bg-accent text-white text-base px-3 py-2 rounded-md"
      {...props}
    />
  )
}


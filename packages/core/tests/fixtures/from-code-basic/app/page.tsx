import { Button } from "./components/Button"
import { Card } from "./components/Card"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-text flex items-center justify-center">
      <Card>
        <Button>Click me</Button>
      </Card>
    </main>
  )
}


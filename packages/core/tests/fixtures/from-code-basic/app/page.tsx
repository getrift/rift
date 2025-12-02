import { Button, SecondaryButton } from "./components/Button"
import { Card } from "./components/Card"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-text flex items-center justify-center">
      <section className="space-y-4 bg-surface p-6 rounded-md">
        <h1 className="text-xl text-text">Welcome to Rift</h1>
        <p className="text-base text-text">Test fixture page that exercises color and type.</p>
        <Card>
          <div className="flex items-center gap-2">
            <Button>Primary</Button>
            <SecondaryButton>Secondary</SecondaryButton>
          </div>
        </Card>
        <div className="bg-accent text-white text-sm rounded-md px-3 py-2">
          Accent badge
        </div>
      </section>
    </main>
  )
}


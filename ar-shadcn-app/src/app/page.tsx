import { SplineSceneBasic } from "@/components/ui/demo"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-slate-900 p-6 font-sans text-neutral-100">
      <main className="relative w-full max-w-6xl">
        <div className="mx-auto flex flex-col items-center gap-12 text-center">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-neutral-400">Experience</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Neon AR Object Explorer Demo
            </h1>
            <p className="mt-4 max-w-2xl text-base text-neutral-400 md:text-lg">
              Drop the Spline scene URL you love and instantly frame it inside a polished shadcn card.
              This example keeps the experience client-side, perfect for immersive landing pages.
            </p>
          </div>

          <SplineSceneBasic />
        </div>
      </main>
    </div>
  )
}

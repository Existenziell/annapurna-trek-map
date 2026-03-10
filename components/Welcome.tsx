'use client'

export interface WelcomeProps {
  onStartTrek: () => void
}

export default function Welcome({ onStartTrek }: WelcomeProps) {
  return (
    <div className="flex flex-col gap-6 rounded-md border border-level-3 bg-level-1 shadow-lg p-6 w-[25rem] max-w-[calc(100vw-2rem)]">
      <h2 className="text-xl font-medium text-level-6">Namaste,</h2>
      <p className="text-level-6 leading-relaxed">
        This is the Annapurna Circuit, one of the most stunning routes in the
        Himalayas. A trek between 160-230 km long encircling the Annapurna
        Massif in Central Nepal. I walked this trek solo in November 2019 and
        want to share some visual impressions.
      </p>
      <button
        type="button"
        onClick={onStartTrek}
        className="button max-w-fit mx-auto"
      >
        Start trek
      </button>
      <p className="text-sm text-level-4">
        Or click a marker on the map to view details.
      </p>
    </div>
  )
}

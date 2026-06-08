'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  'Extracting document text...',
  'Mapping regulatory requirements...',
  'Identifying compliance gaps...',
  'Scoring risk levels...',
  'Generating remediation guidance...',
  'Compiling audit report...',
] as const

type StepState = 'pending' | 'active' | 'complete'

interface AnalysisProgressProps {
  /** When true, all steps show complete and onComplete fires. Driven by the parent when the API returns. */
  done?: boolean
  onComplete?: () => void
  className?: string
}

export function AnalysisProgress({ done = false, onComplete, className = '' }: AnalysisProgressProps) {
  // Timer advances through steps 0-4 (5 steps at 3s each = 15s).
  // Step 5 (last) stays active/pulsing until `done` prop flips to true.
  const [timerStep, setTimerStep] = useState(0)

  useEffect(() => {
    // Stop the timer at the last step — it waits for `done`
    if (timerStep >= STEPS.length - 1) return

    const timer = setTimeout(() => {
      setTimerStep(prev => prev + 1)
    }, 3000)

    return () => clearTimeout(timer)
  }, [timerStep])

  useEffect(() => {
    if (done) {
      setTimerStep(STEPS.length)
      onComplete?.()
    }
  }, [done, onComplete])

  const currentStep = done ? STEPS.length : timerStep
  const progress = Math.round((Math.min(currentStep, STEPS.length - 1) / STEPS.length) * 100)
  // When on last step but not done, show 95% to indicate "almost there"
  const displayProgress = done ? 100 : currentStep >= STEPS.length - 1 ? 95 : progress

  function getState(index: number): StepState {
    if (index < currentStep) return 'complete'
    if (index === currentStep) return 'active'
    return 'pending'
  }

  return (
    <div className={`max-w-md mx-auto p-8 bg-bg-2 border border-rule ${className}`}>
      <p className="font-mono text-xs tracking-widest uppercase text-ink-3 mb-6">
        Analysing your document
      </p>

      <ul className="space-y-4">
        {STEPS.map((step, i) => {
          const state = getState(i)
          return (
            <li key={i} className="flex items-center gap-3">
              {state === 'pending' && (
                <span className="w-2 h-2 rounded-full bg-rule shrink-0" />
              )}
              {state === 'active' && (
                <span className="w-2 h-2 rounded-full bg-green animate-pulse shrink-0" />
              )}
              {state === 'complete' && (
                <span className="text-green font-bold text-sm shrink-0">&#10003;</span>
              )}
              <span
                className="text-sm"
                style={{
                  color: state === 'pending' ? 'var(--ink-3)' : 'var(--ink)',
                  fontWeight: state === 'active' ? 500 : 400,
                }}
              >
                {step}
              </span>
            </li>
          )
        })}
      </ul>

      {/* Progress bar */}
      <div className="mt-6 h-1.5 bg-rule overflow-hidden">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${displayProgress}%`,
            backgroundColor: 'var(--green)',
          }}
        />
      </div>

      {/* Waiting message when on last step but API hasn't returned */}
      {currentStep >= STEPS.length - 1 && !done && (
        <p className="mt-3 text-xs text-ink-3 animate-pulse">
          This may take up to 30 seconds depending on document size...
        </p>
      )}
    </div>
  )
}

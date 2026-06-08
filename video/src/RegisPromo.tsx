import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

// ── Design tokens matching RegisAI brand ──────────────────────────────────────
const GREEN = '#1a3a2a'
const GREEN2 = '#2d5c44'
const GREEN_TINT = '#e4efe8'
const BG = '#f5f0e8'
const BG2 = '#ede7d9'
const INK = '#1a1714'
const INK2 = '#3d3830'
const INK3 = '#5a5248'
const GOLD = '#b8820a'
const RED = '#8b2020'
const RULE = '#ccc4b8'

// ── Shared components ─────────────────────────────────────────────────────────

const RegisLogo: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = BG,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div
      style={{
        width: size * 0.25,
        height: size * 0.25,
        borderRadius: '50%',
        backgroundColor: GOLD,
      }}
    />
    <span
      style={{
        fontFamily: 'Georgia, serif',
        fontSize: size,
        fontWeight: 700,
        fontStyle: 'italic',
        color,
        letterSpacing: -1,
      }}
    >
      Regis
    </span>
    <span
      style={{
        fontFamily: 'monospace',
        fontSize: size * 0.28,
        color: color === BG ? 'rgba(255,255,255,0.5)' : INK3,
        letterSpacing: 3,
        textTransform: 'uppercase' as const,
        marginLeft: -4,
        marginTop: size * 0.15,
      }}
    >
      compliance operations
    </span>
  </div>
)

function FadeIn({
  children,
  frame,
  start,
  duration = 15,
}: {
  children: React.ReactNode
  frame: number
  start: number
  duration?: number
}) {
  const opacity = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const y = interpolate(frame, [start, start + duration], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
  )
}

function ScreenMockup({
  src,
  frame,
  start,
  scale = 0.52,
}: {
  src: string
  frame: number
  start: number
  scale?: number
}) {
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - start, fps, config: { damping: 80, stiffness: 100 } })
  const opacity = interpolate(frame, [start, start + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return (
    <div
      style={{
        opacity,
        transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        border: `1px solid ${RULE}`,
      }}
    >
      <Img src={src} style={{ width: 1920 * scale, display: 'block' }} />
    </div>
  )
}

// ── Scene 1: Hook (0-5s) ────────────────────────────────────────────────────

function SceneHook() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill
      style={{
        backgroundColor: GREEN,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 100px',
      }}
    >
      <FadeIn frame={frame} start={10}>
        <RegisLogo size={42} />
      </FadeIn>
      <div style={{ height: 48 }} />
      <FadeIn frame={frame} start={30}>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 54,
            color: BG,
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 860,
          }}
        >
          Your compliance documentation has gaps.
        </h1>
      </FadeIn>
      <FadeIn frame={frame} start={60}>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 54,
            color: GOLD,
            textAlign: 'center',
            lineHeight: 1.2,
            fontStyle: 'italic',
            maxWidth: 860,
          }}
        >
          You just don't know where yet.
        </h1>
      </FadeIn>
    </AbsoluteFill>
  )
}

// ── Scene 2: Problem (5-12s) ────────────────────────────────────────────────

function SceneProblem() {
  const frame = useCurrentFrame()
  const stats = [
    { value: '\u00a350K+', label: 'Annual compliance spend', delay: 15 },
    { value: '4\u20138 wks', label: 'Manual review time', delay: 35 },
    { value: '1 in 3', label: 'Firms cite doc gaps as risk', delay: 55 },
  ]
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 80px',
      }}
    >
      <FadeIn frame={frame} start={5}>
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            letterSpacing: 4,
            textTransform: 'uppercase' as const,
            color: INK3,
            marginBottom: 16,
          }}
        >
          The Problem
        </p>
      </FadeIn>
      <FadeIn frame={frame} start={10}>
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 42,
            color: INK,
            textAlign: 'center',
            lineHeight: 1.25,
            maxWidth: 760,
            marginBottom: 50,
          }}
        >
          Compliance reviews are still manual, expensive, and error-prone.
        </h2>
      </FadeIn>
      <div style={{ display: 'flex', gap: 50 }}>
        {stats.map((s, i) => (
          <FadeIn key={i} frame={frame} start={s.delay}>
            <div style={{ textAlign: 'center', width: 240 }}>
              <div
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 48,
                  fontWeight: 700,
                  color: GREEN,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: 15,
                  color: INK3,
                  marginTop: 8,
                }}
              >
                {s.label}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  )
}

// ── Scene 3: Solution (12-18s) ──────────────────────────────────────────────

function SceneSolution() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill
      style={{
        backgroundColor: GREEN,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 100px',
      }}
    >
      <div style={{ maxWidth: 900 }}>
        <FadeIn frame={frame} start={5}>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              letterSpacing: 4,
              textTransform: 'uppercase' as const,
              color: GREEN_TINT,
              opacity: 0.6,
              marginBottom: 20,
            }}
          >
            The Solution
          </p>
        </FadeIn>
        <FadeIn frame={frame} start={15}>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 44,
              color: BG,
              lineHeight: 1.25,
              marginBottom: 20,
            }}
          >
            Regis reviews your compliance documents and maps them against{' '}
            <span style={{ color: GOLD, fontStyle: 'italic' }}>
              regulatory requirements
            </span>
            .
          </h2>
        </FadeIn>
        <FadeIn frame={frame} start={40}>
          <p style={{ fontSize: 20, color: GREEN_TINT, opacity: 0.8, lineHeight: 1.6 }}>
            In minutes, not weeks.
          </p>
        </FadeIn>
      </div>
    </AbsoluteFill>
  )
}

// ── Scene 4: Platform demo (18-30s) ─────────────────────────────────────────

function SceneHowItWorks() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 60px',
      }}
    >
      <FadeIn frame={frame} start={5}>
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            letterSpacing: 4,
            textTransform: 'uppercase' as const,
            color: GREEN,
            marginBottom: 24,
          }}
        >
          Upload · Analyse · Review · Fix
        </p>
      </FadeIn>

      {frame < 180 && (
        <ScreenMockup
          src={staticFile('screen-landing.png')}
          frame={frame}
          start={15}
          scale={0.50}
        />
      )}
      {frame >= 180 && frame < 270 && (
        <ScreenMockup
          src={staticFile('screen-report.png')}
          frame={frame}
          start={180}
          scale={0.50}
        />
      )}
      {frame >= 270 && (
        <ScreenMockup
          src={staticFile('screen-findings.png')}
          frame={frame}
          start={270}
          scale={0.50}
        />
      )}
    </AbsoluteFill>
  )
}

// ── Scene 5: Findings (30-38s) ──────────────────────────────────────────────

function SceneResults() {
  const frame = useCurrentFrame()
  const findings = [
    { rule: 'Consumer Duty', risk: 'HIGH', color: RED },
    { rule: 'Senior Manager Accountability', risk: 'HIGH', color: RED },
    { rule: 'Operational Resilience', risk: 'MED', color: GOLD },
    { rule: 'Business Continuity', risk: 'LOW', color: INK3 },
  ]
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 80px',
        gap: 60,
      }}
    >
      <div style={{ flex: 1, maxWidth: 480 }}>
        <FadeIn frame={frame} start={5}>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              letterSpacing: 4,
              textTransform: 'uppercase' as const,
              color: GREEN,
              marginBottom: 14,
            }}
          >
            Structured Findings
          </p>
        </FadeIn>
        <FadeIn frame={frame} start={15}>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 36,
              color: INK,
              lineHeight: 1.25,
              marginBottom: 20,
            }}
          >
            Every finding includes a risk rating, citation, and{' '}
            <span style={{ color: GREEN }}>ready-to-review policy language</span>.
          </h2>
        </FadeIn>
        <FadeIn frame={frame} start={40}>
          <p style={{ fontSize: 16, color: INK3 }}>
            Human review built in. Always.
          </p>
        </FadeIn>
        <FadeIn frame={frame} start={55}>
          <p style={{ fontSize: 12, color: INK3, marginTop: 12, fontStyle: 'italic' }}>
            Illustrative example only. Not drawn from real client data.
          </p>
        </FadeIn>
      </div>
      <div style={{ flex: 1, maxWidth: 460 }}>
        {findings.map((f, i) => (
          <FadeIn key={i} frame={frame} start={30 + i * 20}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                marginBottom: 8,
                backgroundColor: 'white',
                border: `1px solid ${RULE}`,
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  fontWeight: 700,
                  color: f.color,
                  padding: '3px 8px',
                  border: `1px solid ${f.color}`,
                  backgroundColor: `${f.color}10`,
                  minWidth: 42,
                  textAlign: 'center',
                }}
              >
                {f.risk}
              </span>
              <span style={{ fontFamily: 'sans-serif', fontSize: 14, color: INK }}>
                {f.rule}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </AbsoluteFill>
  )
}

// ── Scene 6: CTA (38-45s) ───────────────────────────────────────────────────

function SceneCTA() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const pulse = spring({ frame: frame - 60, fps, config: { damping: 5, stiffness: 40 } })
  return (
    <AbsoluteFill
      style={{
        backgroundColor: GREEN,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FadeIn frame={frame} start={10}>
        <RegisLogo size={48} />
      </FadeIn>
      <div style={{ height: 40 }} />
      <FadeIn frame={frame} start={25}>
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 42,
            color: BG,
            textAlign: 'center',
            lineHeight: 1.25,
            maxWidth: 700,
          }}
        >
          Audit-ready compliance intelligence for{' '}
          <span style={{ color: GOLD, fontStyle: 'italic' }}>
            financial services
          </span>
          .
        </h2>
      </FadeIn>
      <div style={{ height: 36 }} />
      <FadeIn frame={frame} start={50}>
        <div
          style={{
            transform: `scale(${interpolate(pulse, [0, 1], [1, 1.05])})`,
            padding: '16px 42px',
            backgroundColor: BG,
            color: GREEN,
            fontFamily: 'sans-serif',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Try it free at regis.today
        </div>
      </FadeIn>
    </AbsoluteFill>
  )
}

// ── Main composition ──────────────────────────────────────────────────────────

export const RegisPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: GREEN }}>
      {/* Atlas Audio, Futuristic. Pre-attenuated to sit under voiceover. */}
      <Audio src={staticFile('bg-music.mp3')} volume={0.85} />

      {/* Scene 1: Hook (0-5s) */}
      <Sequence from={0} durationInFrames={150}>
        <SceneHook />
        <Audio src={staticFile('vo-01-hook.mp3')} volume={0.9} />
      </Sequence>

      {/* Scene 2: Problem (5-12s) */}
      <Sequence from={150} durationInFrames={210}>
        <SceneProblem />
        <Audio src={staticFile('vo-02-problem.mp3')} volume={0.9} />
      </Sequence>

      {/* Scene 3: Solution (12-18s) */}
      <Sequence from={360} durationInFrames={180}>
        <SceneSolution />
        <Audio src={staticFile('vo-03-solution.mp3')} volume={0.9} />
      </Sequence>

      {/* Scene 4: How it works (18-30s) */}
      <Sequence from={540} durationInFrames={360}>
        <SceneHowItWorks />
        <Audio src={staticFile('vo-04-how.mp3')} volume={0.9} />
      </Sequence>

      {/* Scene 5: Results (30-38s) */}
      <Sequence from={900} durationInFrames={240}>
        <SceneResults />
        <Audio src={staticFile('vo-05-results.mp3')} volume={0.9} />
      </Sequence>

      {/* Scene 6: CTA (38-45s) */}
      <Sequence from={1140} durationInFrames={210}>
        <SceneCTA />
        <Audio src={staticFile('vo-06-cta.mp3')} volume={0.9} />
      </Sequence>
    </AbsoluteFill>
  )
}

import { jsPDF } from 'jspdf'
import type { Audit, Finding, RiskLevel } from '@/types'

const INK: [number, number, number]   = [26, 26, 26]
const INK2: [number, number, number]  = [74, 74, 74]
const INK3: [number, number, number]  = [138, 138, 138]
const GREEN: [number, number, number] = [26, 58, 42]
const GOLD: [number, number, number]  = [139, 117, 53]
const RED: [number, number, number]   = [139, 26, 26]
const BG: [number, number, number]    = [245, 240, 232]
const RULE: [number, number, number]  = [204, 196, 184]
const WHITE: [number, number, number] = [255, 255, 255]

type RGB = [number, number, number]

const RISK_COLOURS: Record<RiskLevel, RGB> = {
  High: RED,
  Medium: GOLD,
  Low: INK3,
}

// ── Layout ──────────────────────────────────────────────────────────────────
const MARGIN = 20
const PAGE_W = 210 // A4 mm
const CONTENT_W = PAGE_W - MARGIN * 2


// ── Public ──────────────────────────────────────────────────────────────────
export function generateAuditPdf(
  audit: Audit,
  findings: Finding[],
  _frameworkLabel?: string | null,
): ArrayBuffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const sorted = [...findings].sort((a, b) => {
    const order: Record<RiskLevel, number> = { High: 0, Medium: 1, Low: 2 }
    return (order[a.risk] ?? 2) - (order[b.risk] ?? 2)
  })

  const date = new Date(audit.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  let y = 0

  // ── Header bar ────────────────────────────────────────────────────────
  doc.setFillColor(...GREEN)
  doc.rect(0, 0, PAGE_W, 45, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...WHITE)
  doc.text('REGIS', MARGIN, 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6)
  doc.text('AI-Powered Compliance Review', MARGIN, 17)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(audit.firm_name, MARGIN, 30)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`Regulatory Gap Analysis  ·  ${date}`, MARGIN, 38)

  y = 55

  // ── Compliance Overview boxes ─────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...INK)
  doc.text('Compliance Overview', MARGIN, y)
  y += 3

  doc.setDrawColor(...RULE)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  y += 5

  const boxW = (CONTENT_W - 9) / 4
  const boxH = 18
  const boxes = [
    { value: String(audit.total_gaps), label: 'TOTAL GAPS', colour: INK },
    { value: String(audit.high_risk), label: 'HIGH RISK', colour: RED },
    { value: String(audit.medium_risk), label: 'MEDIUM RISK', colour: GOLD },
    { value: String(audit.low_risk), label: 'LOW RISK', colour: INK3 },
  ] as const

  boxes.forEach((b, i) => {
    const x = MARGIN + i * (boxW + 3)
    doc.setDrawColor(...RULE)
    doc.setLineWidth(0.3)
    doc.rect(x, y, boxW, boxH)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(...b.colour)
    doc.text(b.value, x + boxW / 2, y + 10, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5)
    doc.setTextColor(...INK3)
    doc.text(b.label, x + boxW / 2, y + 15, { align: 'center' })
  })

  y += boxH + 4

  if (audit.compliance_score != null) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...GREEN)
    doc.text(`Compliance posture: ${audit.compliance_score}%`, MARGIN, y)
    y += 6
  }

  y += 4

  // ── Compliance Posture Overview ─────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...INK)
  doc.text('Compliance Posture Overview', MARGIN, y)
  y += 3
  doc.setDrawColor(...RULE)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...INK2)
  const summaryLines = doc.splitTextToSize(audit.exec_summary ?? '', CONTENT_W - 4)
  doc.text(summaryLines, MARGIN + 2, y)
  y += summaryLines.length * 3.5 + 4

  // ── Priority Actions ──────────────────────────────────────────────────
  if (audit.priority_actions?.length) {
    if (y > 240) { doc.addPage(); y = MARGIN }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...INK)
    doc.text('Priority Actions', MARGIN, y)
    y += 3
    doc.setDrawColor(...RULE)
    doc.line(MARGIN, y, PAGE_W - MARGIN, y)
    y += 5

    audit.priority_actions.forEach((action, i) => {
      if (y > 270) { doc.addPage(); y = MARGIN }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(...GREEN)
      doc.text(`${i + 1}.`, MARGIN, y)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...INK2)
      const lines = doc.splitTextToSize(action, CONTENT_W - 10)
      doc.text(lines, MARGIN + 6, y)
      y += lines.length * 3 + 2
    })
    y += 4
  }

  // ── Findings ──────────────────────────────────────────────────────────
  if (y > 220) { doc.addPage(); y = MARGIN }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...INK)
  doc.text(`Findings (${sorted.length})`, MARGIN, y)
  y += 3
  doc.setDrawColor(...RULE)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  y += 5

  sorted.forEach((finding) => {
    if (y > 250) { doc.addPage(); y = MARGIN }

    // Risk badge
    const riskCol = RISK_COLOURS[finding.risk] ?? INK3
    doc.setFillColor(...riskCol)
    doc.rect(MARGIN, y - 3, 16, 5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(5)
    doc.setTextColor(...WHITE)
    doc.text(finding.risk.toUpperCase(), MARGIN + 8, y, { align: 'center' })

    // Rule citation
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5)
    doc.setTextColor(...INK3)
    doc.text(finding.rule ?? '', MARGIN + 20, y)

    y += 4

    // Requirement name
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...INK)
    doc.text(finding.requirement ?? '', MARGIN, y)
    y += 4

    // Gap
    if (finding.gap) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(5)
      doc.setTextColor(...INK3)
      doc.text('GAP', MARGIN, y)
      y += 3
      doc.setFontSize(7)
      doc.setTextColor(...INK)
      const gapLines = doc.splitTextToSize(finding.gap, CONTENT_W)
      doc.text(gapLines, MARGIN, y)
      y += gapLines.length * 3 + 2
    }

    // Recommendation
    if (finding.recommendation) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(5)
      doc.setTextColor(...INK3)
      doc.text('RECOMMENDATION', MARGIN, y)
      y += 3
      doc.setFontSize(7)
      doc.setTextColor(...GREEN)
      const recLines = doc.splitTextToSize(finding.recommendation, CONTENT_W)
      doc.text(recLines, MARGIN, y)
      y += recLines.length * 3 + 2
    }

    // Drafted policy
    if (finding.drafted_policy) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(5)
      doc.setTextColor(...INK3)
      doc.text('DRAFTED POLICY LANGUAGE', MARGIN, y)
      y += 3
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(6)
      doc.setTextColor(...INK2)
      const policyLines = doc.splitTextToSize(finding.drafted_policy, CONTENT_W - 4)
      doc.text(policyLines, MARGIN + 2, y)
      y += policyLines.length * 2.5 + 2
    }

    // Separator
    y += 2
    doc.setDrawColor(...RULE)
    doc.setLineWidth(0.2)
    doc.line(MARGIN, y, PAGE_W - MARGIN, y)
    y += 4
  })

  // ── Strengths ─────────────────────────────────────────────────────────
  if (audit.strengths?.length) {
    if (y > 240) { doc.addPage(); y = MARGIN }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...INK)
    doc.text('Strengths', MARGIN, y)
    y += 3
    doc.setDrawColor(...RULE)
    doc.line(MARGIN, y, PAGE_W - MARGIN, y)
    y += 5

    audit.strengths.forEach((s) => {
      if (y > 270) { doc.addPage(); y = MARGIN }
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...GREEN)
      doc.text('✓', MARGIN, y)
      doc.setTextColor(...INK2)
      const lines = doc.splitTextToSize(s, CONTENT_W - 8)
      doc.text(lines, MARGIN + 5, y)
      y += lines.length * 3 + 2
    })
  }

  // ── Footer disclaimer ─────────────────────────────────────────────────
  if (y > 260) { doc.addPage(); y = MARGIN }
  y += 6
  doc.setDrawColor(...RULE)
  doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  y += 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(5)
  doc.setTextColor(...INK3)
  const disclaimer = 'This report was generated by RegisAI using AI-assisted analysis. All findings require human review by a qualified compliance professional before remediation. AI-generated recommendations are advisory only and do not constitute legal or regulatory advice.'
  const discLines = doc.splitTextToSize(disclaimer, CONTENT_W)
  doc.text(discLines, MARGIN, y)
  y += discLines.length * 2.5 + 3

  doc.text(`Generated: ${new Date().toISOString().slice(0, 19)}Z  ·  RegisAI Compliance Platform`, MARGIN, y)

  return doc.output('arraybuffer')
}

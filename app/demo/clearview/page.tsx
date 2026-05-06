import { CLEARVIEW_DEMO } from '@/lib/demo-data'
import { AuditReport } from '@/components/audit/audit-report'

// Public page — no login required. Share this link after sales calls.
export const dynamic = 'force-dynamic'

export default function ClearviewDemoPage() {
  return <AuditReport audit={CLEARVIEW_DEMO} isDemo />
}

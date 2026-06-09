import { createClient } from '@/lib/supabase/server'
import { MonitoringClient } from './monitoring-client'

export default async function MonitoringPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('is_dev').eq('id', user.id).single()
    : { data: null }

  return <MonitoringClient isDevUser={(profile as { is_dev?: boolean } | null)?.is_dev ?? false} />
}

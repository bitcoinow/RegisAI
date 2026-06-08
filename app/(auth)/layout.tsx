import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies()
  if (jar.get('regis-session')) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      {children}
    </div>
  )
}

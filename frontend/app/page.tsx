import { redirect } from 'next/navigation'

export default function Home() {
  // This will be handled client-side
  redirect('/login')
}

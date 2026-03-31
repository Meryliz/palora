import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-purple-800 mb-4">Palora</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        Värvi koos sõpradega — reaalajas kollaboratiivne värvimisrakendus
      </p>
      <div className="flex gap-4">
        <Link href="/register" className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg hover:bg-purple-700">
          Alusta tasuta
        </Link>
        <Link href="/login" className="border border-purple-600 text-purple-600 px-8 py-3 rounded-full text-lg hover:bg-purple-50">
          Logi sisse
        </Link>
      </div>
    </main>
  )
}
'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff9f0 0%, #f0f4ff 50%, #f9f0ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎨</div>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 800, color: '#2d2d2d' }}>Tere tulemast!</h1>
          <p style={{ margin: 0, color: '#aaa', fontSize: '15px' }}>Logi sisse oma Palora kontole</p>
        </div>

        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#c00', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ border: '1.5px solid #e8e4de', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#2d2d2d', outline: 'none', background: '#fdfcfa' }}
          />
          <input
            type="password"
            placeholder="Parool"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ border: '1.5px solid #e8e4de', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#2d2d2d', outline: 'none', background: '#fdfcfa' }}
          />
          <div style={{ textAlign: 'right' }}>
            <Link href="/forgot-password" style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
              Unustasid parooli?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, color: 'white', cursor: 'pointer', marginTop: '4px' }}
          >
            {loading ? 'Laadin...' : 'Logi sisse'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#aaa', fontSize: '14px' }}>
          Pole kontot?{' '}
          <Link href="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
            Registreeru
          </Link>
        </p>
      </div>
    </main>
  )
}
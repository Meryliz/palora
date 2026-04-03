'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.palora.ee/reset-password'
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fff9f0 0%, #f0f4ff 50%, #f9f0ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔑</div>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 800, color: '#2d2d2d' }}>Unustasid parooli?</h1>
          <p style={{ margin: 0, color: '#aaa', fontSize: '15px' }}>Saadame sulle parooli lähtestamise lingi</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#f0faf0', border: '1px solid #c0e0c0', borderRadius: '12px', padding: '20px', marginBottom: '24px', color: '#2a7a2a', fontSize: '14px' }}>
              ✅ Link saadetud! Kontrolli oma meili.
            </div>
            <Link href="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none', fontSize: '14px' }}>
              ← Tagasi sisselogimisele
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#c00', fontSize: '14px' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="email"
                placeholder="Sinu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ border: '1.5px solid #e8e4de', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', color: '#2d2d2d', outline: 'none', background: '#fdfcfa' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, color: 'white', cursor: 'pointer', marginTop: '8px' }}
              >
                {loading ? 'Saadan...' : 'Saada link'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '24px', color: '#aaa', fontSize: '14px' }}>
              <Link href="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
                ← Tagasi sisselogimisele
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [illustrations, setIllustrations] = useState<any[]>([])
  const [difficulty, setDifficulty] = useState('easy')
  const [purchases, setPurchases] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const getPurchases = async () => {
      if (!user) return
      const { data } = await supabase
        .from('purchases')
        .select('illustration_id')
        .eq('user_id', user.id)
      setPurchases(data?.map(p => p.illustration_id) || [])
    }
    getPurchases()
  }, [user])

  useEffect(() => {
    const getIllustrations = async () => {
      const { data } = await supabase
        .from('illustrations')
        .select('*')
        .eq('difficulty', difficulty)
        .order('order_num')
      setIllustrations(data || [])
    }
    getIllustrations()
  }, [difficulty])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleBuy = async (ill: any) => {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        illustrationId: ill.id,
        illustrationTitle: ill.title,
        price: 1.00,
        userId: user?.id
      })
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const levels = [
    { key: 'easy', label: 'Algaja', desc: 'Lihtsad ja suured alad', color: '#a8d8a8', bg: '#f0faf0' },
    { key: 'medium', label: 'Harrastaja', desc: 'Loomad ja kujundid', color: '#f4a96e', bg: '#fff7f0' },
    { key: 'hard', label: 'Meister', desc: 'Detailsed ja keerulised pildid', color: '#b8a0e8', bg: '#f5f0ff' }
  ]

  const current = levels.find(l => l.key === difficulty)!

  return (
    <main style={{ minHeight: '100vh', background: '#fdfcfa', fontFamily: 'Segoe UI, sans-serif' }}>
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #f0ece6',
        padding: '0 40px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '28px' }}>🎨</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#2d2d2d', letterSpacing: '-0.5px' }}>Palora</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#aaa', fontSize: '13px' }}>{user?.email}</span>
          <Link href="/groups" style={{ background: '#f0f0ff', border: '1px solid #c0c0ff', borderRadius: '100px', padding: '8px 18px', color: '#6060cc', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
            👥 Grupid
          </Link>
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', color: '#666', padding: '8px 18px', borderRadius: '100px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
            Logi välja
          </button>
        </div>
      </header>

      <div style={{ background: 'linear-gradient(135deg, #fff9f0 0%, #f0f4ff 50%, #f9f0ff 100%)', padding: '56px 40px', textAlign: 'center', borderBottom: '1px solid #f0ece6' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#2d2d2d', margin: '0 0 12px', letterSpacing: '-1px' }}>
          Tere tulemast Palorasse! 🌈
        </h1>
        <p style={{ fontSize: '17px', color: '#888', margin: '0 auto', maxWidth: '460px', lineHeight: 1.6 }}>
          Vali pilt, kutsu sõbrad ja värvige koos reaalajas
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          {levels.map(l => (
            <button
              key={l.key}
              onClick={() => setDifficulty(l.key)}
              style={{
                flex: 1,
                background: difficulty === l.key ? l.bg : '#ffffff',
                border: `2px solid ${difficulty === l.key ? l.color : '#ede9e3'}`,
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                boxShadow: difficulty === l.key ? `0 4px 20px ${l.color}44` : 'none'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: difficulty === l.key ? '#2d2d2d' : '#aaa', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {l.label.toUpperCase()}
              </div>
              <div style={{ fontSize: '13px', color: difficulty === l.key ? '#666' : '#ccc' }}>
                {l.desc}
              </div>
              <div style={{ width: '32px', height: '4px', borderRadius: '2px', background: difficulty === l.key ? l.color : '#ede9e3', marginTop: '12px', transition: 'all 0.2s' }} />
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {illustrations.map(ill => {
            const isUnlocked = ill.is_free || purchases.includes(ill.id)
            return (
              <div key={ill.id}
                style={{ background: '#ffffff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f0ece6', transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {isUnlocked ? (
                  <Link href={`/color/${ill.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ background: '#f8f8f8', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                      dangerouslySetInnerHTML={{ __html: ill.svg_data ? ill.svg_data.replace('<svg ', '<svg style="width:100%;height:180px;" ') : '' }}
                    />
                  </Link>
                ) : (
                  <div style={{ background: '#f8f8f8', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', zIndex: 1 }}>🔒</div>
                    <div dangerouslySetInnerHTML={{ __html: ill.svg_data ? ill.svg_data.replace('<svg ', '<svg style="width:100%;height:180px;opacity:0.4;" ') : '' }} />
                  </div>
                )}

                <div style={{ padding: '16px 20px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#2d2d2d' }}>
                      {ill.title}
                    </h3>
                    {isUnlocked ? (
                      <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', background: '#e8f8e8', color: '#2a7a2a', fontWeight: 600 }}>
                        {ill.is_free ? '✓ Tasuta' : '✓ Ostetud'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(ill)}
                        style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', background: '#fff0e8', color: '#c06020', fontWeight: 600, border: '1px solid #f4c090', cursor: 'pointer' }}
                      >
                        🔒 1.00€
                      </button>
                    )}
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: current.color }} />
                    <span style={{ fontSize: '12px', color: '#aaa' }}>{current.label} tase</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {illustrations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: '#ccc' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
            <p style={{ fontSize: '16px' }}>Pilte ei leitud</p>
          </div>
        )}
      </div>
    </main>
  )
}
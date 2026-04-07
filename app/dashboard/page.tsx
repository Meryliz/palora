'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [illustrations, setIllustrations] = useState<any[]>([])
  const [difficulty, setDifficulty] = useState('easy')
  const [purchases, setPurchases] = useState<string[]>([])
  const [myGroups, setMyGroups] = useState<any[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const groupParam = searchParams.get('group')
      if (groupParam) setSelectedGroupId(groupParam)
    }
    getUser()
  }, [])

  useEffect(() => {
    const getPurchases = async () => {
      if (!user) return

      const { data: personalPurchases } = await supabase
        .from('purchases')
        .select('illustration_id')
        .eq('user_id', user.id)

      const { data: memberGroups } = await supabase
        .from('group_members')
        .select('group_id, groups(*)')
        .eq('user_id', user.id)

      const groupIds = memberGroups?.map(g => g.group_id) || []
      setMyGroups(memberGroups?.map((m: any) => m.groups).filter(Boolean) || [])

      let groupIllustrationIds: string[] = []
      if (groupIds.length > 0) {
        const { data: groupPurchases } = await supabase
          .from('group_purchases')
          .select('illustration_id')
          .in('group_id', groupIds)
        groupIllustrationIds = groupPurchases?.map(p => p.illustration_id) || []
      }

      const allPurchases = [
        ...(personalPurchases?.map(p => p.illustration_id) || []),
        ...groupIllustrationIds
      ]

      setPurchases([...new Set(allPurchases)])
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
    { key: 'easy', label: 'Algaja', desc: 'Lihtsad alad', color: '#a8d8a8', bg: '#f0faf0' },
    { key: 'medium', label: 'Harrastaja', desc: 'Loomad', color: '#f4a96e', bg: '#fff7f0' },
    { key: 'hard', label: 'Meister', desc: 'Keerulised', color: '#b8a0e8', bg: '#f5f0ff' }
  ]

  const current = levels.find(l => l.key === difficulty)!
  const selectedGroup = myGroups.find((g: any) => g.id === selectedGroupId)

  return (
    <main style={{ minHeight: '100vh', background: '#fdfcfa', fontFamily: 'Segoe UI, sans-serif' }}>
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #f0ece6',
        padding: '0 16px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '22px' }}>🎨</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#2d2d2d' }}>Palora</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/groups" style={{ background: '#f0f0ff', border: '1px solid #c0c0ff', borderRadius: '100px', padding: '6px 12px', color: '#6060cc', textDecoration: 'none', fontSize: '12px', fontWeight: 500 }}>
            👥 Grupid
          </Link>
          <button onClick={handleLogout} style={{ background: '#f5f5f5', border: 'none', color: '#666', padding: '6px 12px', borderRadius: '100px', cursor: 'pointer', fontSize: '12px' }}>
            Välja
          </button>
        </div>
      </header>

      <div style={{ background: 'linear-gradient(135deg, #fff9f0 0%, #f0f4ff 50%, #f9f0ff 100%)', padding: 'clamp(20px, 4vw, 40px) 16px', borderBottom: '1px solid #f0ece6' }}>
        <h1 style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 800, color: '#2d2d2d', margin: '0 0 12px', letterSpacing: '-1px', textAlign: 'center' }}>
          Tere tulemast! 🌈
        </h1>

        {/* Grupi valija */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setSelectedGroupId(null)}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: '2px solid',
              borderColor: !selectedGroupId ? '#818cf8' : '#e8e4de',
              background: !selectedGroupId ? '#f0f0ff' : 'white',
              color: !selectedGroupId ? '#4040cc' : '#888',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            👤 Isiklik
          </button>
          {myGroups.map((group: any) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: '2px solid',
                borderColor: selectedGroupId === group.id ? '#a78bfa' : '#e8e4de',
                background: selectedGroupId === group.id ? '#f5f0ff' : 'white',
                color: selectedGroupId === group.id ? '#6040a0' : '#888',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              👥 {group.name}
            </button>
          ))}
        </div>

        {selectedGroupId && selectedGroup && (
          <p style={{ textAlign: 'center', margin: '10px 0 0', fontSize: '13px', color: '#888' }}>
            Värvid koos grupiga <strong>{selectedGroup.name}</strong>
          </p>
        )}
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
          {levels.map(l => (
            <button
              key={l.key}
              onClick={() => setDifficulty(l.key)}
              style={{
                flex: '0 0 auto',
                background: difficulty === l.key ? l.bg : '#ffffff',
                border: `2px solid ${difficulty === l.key ? l.color : '#ede9e3'}`,
                borderRadius: '14px',
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                minWidth: '110px',
                boxShadow: difficulty === l.key ? `0 4px 20px ${l.color}44` : 'none'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: difficulty === l.key ? '#2d2d2d' : '#aaa', marginBottom: '2px' }}>
                {l.label.toUpperCase()}
              </div>
              <div style={{ fontSize: '11px', color: difficulty === l.key ? '#666' : '#ccc' }}>
                {l.desc}
              </div>
              <div style={{ width: '24px', height: '3px', borderRadius: '2px', background: difficulty === l.key ? l.color : '#ede9e3', marginTop: '8px' }} />
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {illustrations.map(ill => {
            const isUnlocked = ill.is_free || purchases.includes(ill.id)
            const colorLink = selectedGroupId
              ? `/color/${ill.id}?group=${selectedGroupId}`
              : `/color/${ill.id}`

            return (
              <div key={ill.id}
                style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0ece6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
              >
                {isUnlocked ? (
                  <Link href={colorLink} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ background: '#f8f8f8', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                      dangerouslySetInnerHTML={{ __html: ill.svg_data ? ill.svg_data.replace('<svg ', '<svg style="width:100%;height:148px;" ') : '' }}
                    />
                  </Link>
                ) : (
                  <div style={{ background: '#f8f8f8', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', zIndex: 1 }}>🔒</div>
                    <div dangerouslySetInnerHTML={{ __html: ill.svg_data ? ill.svg_data.replace('<svg ', '<svg style="width:100%;height:148px;opacity:0.4;" ') : '' }} />
                  </div>
                )}

                <div style={{ padding: '12px 16px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#2d2d2d' }}>
                      {ill.title}
                    </h3>
                    {isUnlocked ? (
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '100px', background: '#e8f8e8', color: '#2a7a2a', fontWeight: 600 }}>
                        {ill.is_free ? '✓ Tasuta' : '✓ Ostetud'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(ill)}
                        style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '100px', background: '#fff0e8', color: '#c06020', fontWeight: 600, border: '1px solid #f4c090', cursor: 'pointer' }}
                      >
                        🔒 1.00€
                      </button>
                    )}
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: current.color }} />
                    <span style={{ fontSize: '11px', color: '#aaa' }}>{current.label} tase</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {illustrations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#ccc' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎨</div>
            <p>Pilte ei leitud</p>
          </div>
        )}
      </div>
    </main>
  )
}
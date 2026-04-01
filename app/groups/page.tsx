'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Groups() {
  const [user, setUser] = useState<any>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [newGroupName, setNewGroupName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      loadGroups(user.id)
    }
    getUser()
  }, [])

  const loadGroups = async (userId: string) => {
    const { data } = await supabase
      .from('group_members')
      .select('group_id, groups(*)')
      .eq('user_id', userId)

    const uniqueGroups = Array.from(
      new Map((data?.map((d: any) => d.groups) || []).map((g: any) => [g.id, g])).values()
    )
    setGroups(uniqueGroups)
  }

  const createGroup = async () => {
    if (!newGroupName.trim()) return
    setLoading(true)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data: group } = await supabase
      .from('groups')
      .insert({ name: newGroupName, invite_code: code, owner_id: user.id })
      .select()
      .single()

    if (group) {
      await supabase.from('group_members').upsert(
        { group_id: group.id, user_id: user.id },
        { onConflict: 'group_id,user_id' }
      )
      await supabase.from('profiles').upsert({ id: user.id, email: user.email })
      setNewGroupName('')
      setMessage(`Grupp loodud! Kutse kood: ${code}`)
      loadGroups(user.id)
    }
    setLoading(false)
  }

  const joinGroup = async () => {
    if (!inviteCode.trim()) return
    setLoading(true)

    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single()

    if (!group) {
      setMessage('Gruppi ei leitud!')
      setLoading(false)
      return
    }

    await supabase.from('profiles').upsert({ id: user.id, email: user.email })
    await supabase.from('group_members').upsert(
      { group_id: group.id, user_id: user.id },
      { onConflict: 'group_id,user_id' }
    )
    setInviteCode('')
    setMessage(`Liitusid grupiga: ${group.name}!`)
    loadGroups(user.id)
    setLoading(false)
  }

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
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#666' }}>
          ← Tagasi
        </button>
        <span style={{ fontWeight: 700, fontSize: '16px', color: '#2d2d2d' }}>Minu grupid</span>
        <div style={{ width: '60px' }} />
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>

        {message && (
          <div style={{ background: '#f0faf0', border: '1px solid #c0e0c0', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', color: '#2a7a2a', fontSize: '14px' }}>
            {message}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', border: '1px solid #f0ece6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 700, color: '#2d2d2d' }}>Loo uus grupp</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              placeholder="Grupi nimi"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              style={{ flex: 1, border: '1.5px solid #e8e4de', borderRadius: '12px', padding: '11px 14px', fontSize: '14px', color: '#2d2d2d', outline: 'none' }}
            />
            <button
              onClick={createGroup}
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', border: 'none', borderRadius: '12px', padding: '11px 20px', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}
            >
              Loo
            </button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', border: '1px solid #f0ece6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 700, color: '#2d2d2d' }}>Liitu grupiga</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              placeholder="Kutse kood"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              style={{ flex: 1, border: '1.5px solid #e8e4de', borderRadius: '12px', padding: '11px 14px', fontSize: '14px', color: '#2d2d2d', outline: 'none' }}
            />
            <button
              onClick={joinGroup}
              disabled={loading}
              style={{ background: '#f0faf0', border: '1.5px solid #c0e0c0', borderRadius: '12px', padding: '11px 20px', color: '#2a7a2a', fontWeight: 700, cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}
            >
              Liitu
            </button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #f0ece6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 700, color: '#2d2d2d' }}>Minu grupid</h2>
          {groups.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>Sul pole veel gruppe</p>
          ) : (
            groups.map(group => (
              <div key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0ece6', gap: '12px' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#2d2d2d', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.name}</p>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#aaa' }}>Kood: <strong>{group.invite_code}</strong></p>
                </div>
                <Link href={`/dashboard?group=${group.id}`} style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', borderRadius: '10px', padding: '8px 14px', color: 'white', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Värvi koos →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
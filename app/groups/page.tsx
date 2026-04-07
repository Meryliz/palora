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
  const [groupPurchases, setGroupPurchases] = useState<Record<string, string[]>>({})
  const [illustrations, setIllustrations] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
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

  useEffect(() => {
    const getIllustrations = async () => {
      const { data } = await supabase
        .from('illustrations')
        .select('id, title, difficulty, is_free')
        .eq('is_free', false)
        .order('difficulty')
      setIllustrations(data || [])
    }
    getIllustrations()
  }, [])

  const loadGroups = async (userId: string) => {
    const { data: memberData } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId)

    if (!memberData || memberData.length === 0) {
      setGroups([])
      return
    }

    const groupIds = memberData.map((m: any) => m.group_id)

    const { data: groupData } = await supabase
      .from('groups')
      .select('*')
      .in('id', groupIds)

    const groupsWithCount = await Promise.all(
      (groupData || []).map(async (group: any) => {
        const { count } = await supabase
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id)
        return { ...group, memberCount: count || 0 }
      })
    )

    setGroups(groupsWithCount)

    const { data: purchases } = await supabase
      .from('group_purchases')
      .select('group_id, illustration_id')
      .in('group_id', groupIds)

    const purchaseMap: Record<string, string[]> = {}
    purchases?.forEach((p: any) => {
      if (!purchaseMap[p.group_id]) purchaseMap[p.group_id] = []
      purchaseMap[p.group_id].push(p.illustration_id)
    })
    setGroupPurchases(purchaseMap)
  }

  const createGroup = async () => {
    if (!newGroupName.trim()) return
    setLoading(true)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ name: newGroupName, invite_code: code, owner_id: user.id })
      .select()
      .single()

    if (groupError) {
      setMessage('Viga grupi loomisel!')
      setLoading(false)
      return
    }

    if (group) {
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id })

      if (memberError) {
        setMessage('Viga grupiga liitumisel!')
        setLoading(false)
        return
      }

      await supabase.from('profiles').upsert({ id: user.id, email: user.email })
      setNewGroupName('')
      setMessage(`Grupp loodud! Kutse kood: ${code}`)
      await loadGroups(user.id)
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

    const { count } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group.id)

    if (count && count >= 10) {
      setMessage('Grupp on täis! Maksimaalselt 10 liiget.')
      setLoading(false)
      return
    }

    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      await supabase.from('profiles').upsert({ id: user.id, email: user.email })
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id })

      if (memberError) {
        setMessage('Viga grupiga liitumisel!')
        setLoading(false)
        return
      }
    }

    setInviteCode('')
    setMessage(`Liitusid grupiga: ${group.name}!`)
    await loadGroups(user.id)
    setLoading(false)
  }

  const leaveGroup = async (groupId: string, groupName: string, isOwner: boolean) => {
    if (isOwner) {
      setMessage('Grupi looja ei saa grupist lahkuda!')
      return
    }
    if (!confirm(`Kas oled kindel, et tahad lahkuda grupist "${groupName}"?`)) return

    await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id)

    setMessage(`Lahkusid grupist: ${groupName}`)
    await loadGroups(user.id)
  }

  const handleGroupBuy = async (groupId: string, ill: any) => {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        illustrationId: ill.id,
        illustrationTitle: `${ill.title} (grupp)`,
        price: 3.00,
        userId: user?.id,
        groupId
      })
    })
    const { url } = await res.json()
    if (url) window.location.href = url
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

        <div style={{ background: 'linear-gradient(135deg, #f0f4ff, #f9f0ff)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #e0d8f0' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: '#2d2d2d' }}>👥 Grupi info</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
            Grupp on kuni <strong>10 liikmele</strong>. Iga liige saab grupile pilte osta — <strong>3€ per pilt</strong>. Kõik grupiliikmed saavad ostetud pilti koos värvida!
          </p>
        </div>

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
              <div key={group.id} style={{ borderBottom: '1px solid #f0ece6', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#2d2d2d', fontSize: '15px' }}>{group.name}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#aaa' }}>
                      Kood: <strong>{group.invite_code}</strong> · 👥 {group.memberCount}/10 liiget
                    </p>
                  </div>
                  <Link href={`/dashboard?group=${group.id}`} style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', borderRadius: '10px', padding: '8px 14px', color: 'white', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Värvi koos →
                  </Link>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <button
                    onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
                    style={{ background: '#f5f0ff', border: '1px solid #d0c0f0', borderRadius: '10px', padding: '8px 14px', color: '#6040a0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flex: 1, textAlign: 'left' }}
                  >
                    🛒 Osta grupile pilt (3€) {selectedGroup === group.id ? '▲' : '▼'}
                  </button>
                  {group.owner_id !== user?.id && (
                    <button
                      onClick={() => leaveGroup(group.id, group.name, group.owner_id === user?.id)}
                      style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: '10px', padding: '8px 12px', color: '#c00', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Lahku
                    </button>
                  )}
                </div>

                {selectedGroup === group.id && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {illustrations.map(ill => {
                      const isOwned = groupPurchases[group.id]?.includes(ill.id)
                      return (
                        <div key={ill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fafafa', borderRadius: '10px', border: '1px solid #f0ece6' }}>
                          <div>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#2d2d2d' }}>{ill.title}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{ill.difficulty}</p>
                          </div>
                          {isOwned ? (
                            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', background: '#e8f8e8', color: '#2a7a2a', fontWeight: 600 }}>
                              ✓ Ostetud
                            </span>
                          ) : (
                            <button
                              onClick={() => handleGroupBuy(group.id, ill)}
                              style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '100px', background: '#f5f0ff', color: '#6040a0', fontWeight: 600, border: '1px solid #d0c0f0', cursor: 'pointer' }}
                            >
                              3.00€ osta
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
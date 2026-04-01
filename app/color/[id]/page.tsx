'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter, useParams, useSearchParams } from 'next/navigation'

const COLORS = [
  '#FF6B6B', '#FF8E53', '#FFC300', '#2ECC71', '#1ABC9C',
  '#3498DB', '#9B59B6', '#E91E63', '#FF5722', '#795548',
  '#607D8B', '#F06292', '#AED581', '#4FC3F7', '#FFD54F',
  '#A1887F', '#90A4AE', '#80CBC4', '#CE93D8', '#FFFFFF',
  '#000000', '#5D4037', '#1565C0', '#2E7D32', '#F57F17'
]

export default function ColorPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const groupId = searchParams.get('group')
  const router = useRouter()
  const [illustration, setIllustration] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState('#FF6B6B')
  const [sections, setSections] = useState<Record<string, string>>({})
  const [user, setUser] = useState<any>(null)
  const [realtimeStatus, setRealtimeStatus] = useState('')
  const [showColors, setShowColors] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: ill } = await supabase
        .from('illustrations')
        .select('*')
        .eq('id', params.id)
        .single()
      setIllustration(ill)

      let query = supabase
        .from('coloring_progress')
        .select('*')
        .eq('illustration_id', params.id)

      if (groupId) {
        query = query.eq('group_id', groupId)
      } else {
        query = query.eq('user_id', user.id).is('group_id', null)
      }

      const { data } = await query
      if (data) {
        const colorMap: Record<string, string> = {}
        data.forEach((item: any) => { colorMap[item.section_id] = item.color })
        setSections(colorMap)
      }

      setLoaded(true)

      const channelName = groupId
        ? `coloring-group-${groupId}-${params.id}`
        : `coloring-user-${user.id}-${params.id}`

      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'coloring_progress',
          filter: `illustration_id=eq.${params.id}`
        }, payload => {
          const newData = (payload as any).new
          if (!newData) return
          if (groupId && newData.group_id === groupId) {
            setSections(prev => ({ ...prev, [newData.section_id]: newData.color }))
          } else if (!groupId && newData.user_id === user.id && !newData.group_id) {
            setSections(prev => ({ ...prev, [newData.section_id]: newData.color }))
          }
        })
        .subscribe(status => {
          setRealtimeStatus(status)
        })

      return () => { supabase.removeChannel(channel) }
    }

    init()
  }, [params.id, groupId])

  const handleSectionClick = async (sectionId: string) => {
    if (!user) return
    setSections(prev => ({ ...prev, [sectionId]: selectedColor }))

    const { error } = await supabase
      .from('coloring_progress')
      .upsert({
        illustration_id: String(params.id),
        section_id: sectionId,
        color: selectedColor,
        user_id: user.id,
        group_id: groupId || null,
        updated_at: new Date().toISOString()
      })

    if (error) console.error('Upsert error:', error.message)
  }

  const getSvgWithColors = () => {
    if (!illustration?.svg_data) return ''
    let svg = illustration.svg_data
    Object.entries(sections).forEach(([id, color]) => {
      svg = svg.replace(
        new RegExp(`id="${id}"([^>]*?)fill="[^"]*"`, 'g'),
        `id="${id}"$1fill="${color}"`
      )
    })
    return svg
  }

  if (!loaded) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontSize: '32px' }}>🎨</div>
      <p style={{ color: '#aaa', fontSize: '14px' }}>Laadin...</p>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'Segoe UI, sans-serif', display: 'flex', flexDirection: 'column' }}>

      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #f0ece6',
        padding: '0 16px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        flexShrink: 0
      }}>
        <button
          onClick={() => router.push(groupId ? '/groups' : '/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#666', padding: '8px 0' }}
        >
          ← Tagasi
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#2d2d2d' }}>{illustration?.title}</span>
          <span style={{ fontSize: '10px', color: '#aaa' }}>
            {groupId ? '👥 Grupp' : '👤 Isiklik'}
          </span>
        </div>
        <span style={{ fontSize: '10px', color: realtimeStatus === 'SUBSCRIBED' ? '#2ECC71' : '#aaa' }}>
          {realtimeStatus === 'SUBSCRIBED' ? '● Live' : '● ...'}
        </span>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            aspectRatio: '1',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            cursor: 'crosshair'
          }}
          onClick={e => {
            const target = e.target as SVGElement
            const id = target.getAttribute('id')
            if (id && id.startsWith('s')) handleSectionClick(id)
          }}
          dangerouslySetInnerHTML={{
            __html: getSvgWithColors().replace('<svg ', '<svg style="width:100%;height:100%;" ')
          }}
        />
      </div>

      <div style={{
        background: 'white',
        borderTop: '1px solid #f0ece6',
        padding: '12px 16px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: showColors ? '12px' : '0' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: selectedColor, border: '2px solid #e8e4de', flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flex: 1 }}>
            {COLORS.slice(0, 10).map(color => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '30px', height: '30px', borderRadius: '6px', background: color,
                  cursor: 'pointer', flexShrink: 0,
                  border: selectedColor === color ? '3px solid #2d2d2d' : '2px solid #e8e4de'
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setShowColors(!showColors)}
            style={{ background: '#f5f5f5', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', color: '#666', flexShrink: 0 }}
          >
            {showColors ? '▲' : '▼'}
          </button>
        </div>

        {showColors && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px', marginBottom: '10px' }}>
              {COLORS.map(color => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    height: '32px', borderRadius: '6px', background: color,
                    cursor: 'pointer',
                    border: selectedColor === color ? '3px solid #2d2d2d' : '2px solid #e8e4de'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                style={{ width: '40px', height: '36px', border: '1px solid #e8e4de', borderRadius: '8px', cursor: 'pointer', padding: '2px' }}
              />
              <span style={{ fontSize: '12px', color: '#aaa' }}>Kohandatud</span>
              <button
                onClick={async () => {
                  setSections({})
                  let query = supabase.from('coloring_progress').delete().eq('illustration_id', params.id)
                  if (groupId) { query = query.eq('group_id', groupId) }
                  else { query = query.eq('user_id', user?.id).is('group_id', null) }
                  await query
                }}
                style={{ marginLeft: 'auto', background: '#fff5f5', border: '1px solid #fcc', color: '#c00', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
              >
                🗑️ Lähtesta
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
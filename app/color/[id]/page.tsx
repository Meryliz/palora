'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

const COLORS = [
  '#FF6B6B', '#FF8E53', '#FFC300', '#2ECC71', '#1ABC9C',
  '#3498DB', '#9B59B6', '#E91E63', '#FF5722', '#795548',
  '#607D8B', '#F06292', '#AED581', '#4FC3F7', '#FFD54F',
  '#A1887F', '#90A4AE', '#80CBC4', '#CE93D8', '#FFFFFF',
  '#000000', '#5D4037', '#1565C0', '#2E7D32', '#F57F17'
]

export default function ColorPage() {
  const params = useParams()
  const router = useRouter()
  const [illustration, setIllustration] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState('#FF6B6B')
  const [sections, setSections] = useState<Record<string, string>>({})
  const [user, setUser] = useState<any>(null)
  const [realtimeStatus, setRealtimeStatus] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const getIllustration = async () => {
      const { data } = await supabase
        .from('illustrations')
        .select('*')
        .eq('id', params.id)
        .single()
      setIllustration(data)
    }
    getIllustration()
  }, [params.id])

  useEffect(() => {
    const getColors = async () => {
      const { data } = await supabase
        .from('coloring_progress')
        .select('*')
        .eq('illustration_id', params.id)
      
      if (data) {
        const colorMap: Record<string, string> = {}
        data.forEach(item => { colorMap[item.section_id] = item.color })
        setSections(colorMap)
      }
    }
    getColors()

    const channel = supabase
      .channel(`coloring-${params.id}-${Math.random()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'coloring_progress',
        filter: `illustration_id=eq.${params.id}`
      }, payload => {
        console.log('Realtime event:', payload)
        const newData = (payload as any).new
        if (newData) {
          setSections(prev => ({ ...prev, [newData.section_id]: newData.color }))
        }
      })
      .subscribe(status => {
        console.log('Realtime status:', status)
        setRealtimeStatus(status)
      })

    return () => { supabase.removeChannel(channel) }
  }, [params.id])

  const handleSectionClick = async (sectionId: string) => {
    setSections(prev => ({ ...prev, [sectionId]: selectedColor }))

    const { error } = await supabase
      .from('coloring_progress')
      .upsert({
        illustration_id: String(params.id),
        section_id: sectionId,
        color: selectedColor,
        user_id: user?.id,
        updated_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Upsert error:', error.message, error.details, error.hint)
    }
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

  if (!illustration) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>Laadin...</p>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#fdfcfa', fontFamily: "'Segoe UI', sans-serif" }}>
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #f0ece6',
        padding: '0 32px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Tagasi
        </button>
        <span style={{ fontWeight: 700, fontSize: '16px', color: '#2d2d2d' }}>{illustration.title}</span>
        <span style={{ fontSize: '11px', color: realtimeStatus === 'SUBSCRIBED' ? '#2ECC71' : '#aaa' }}>
          {realtimeStatus === 'SUBSCRIBED' ? '● Reaalajas' : '● Ühendab...'}
        </span>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', background: '#fafafa' }}>
          <div
            style={{ width: '500px', height: '500px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', overflow: 'hidden', cursor: 'crosshair' }}
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

        <div style={{ width: '220px', background: '#ffffff', borderLeft: '1px solid #f0ece6', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#2d2d2d' }}>Vali värv</p>
          
          <div style={{
            width: '100%',
            height: '48px',
            borderRadius: '10px',
            background: selectedColor,
            border: '2px solid #e8e4de',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {COLORS.map(color => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: color,
                  cursor: 'pointer',
                  border: selectedColor === color ? '3px solid #2d2d2d' : '2px solid #e8e4de',
                  transition: 'all 0.15s'
                }}
              />
            ))}
          </div>

          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#aaa' }}>Kohandatud värv</p>
            <input
              type="color"
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
              style={{ width: '100%', height: '40px', border: '1px solid #e8e4de', borderRadius: '8px', cursor: 'pointer', padding: '2px' }}
            />
          </div>

          <button
            onClick={async () => {
              setSections({})
              await supabase
                .from('coloring_progress')
                .delete()
                .eq('illustration_id', params.id)
            }}
            style={{
              background: '#fff5f5',
              border: '1px solid #fcc',
              color: '#c00',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              marginTop: 'auto'
            }}
          >
            🗑️ Lähtesta
          </button>
        </div>
      </div>
    </main>
  )
}
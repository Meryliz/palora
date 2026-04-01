import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#fdfcfa', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header */}
      <header style={{
        padding: '0 20px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'white',
        borderBottom: '1px solid #f0ece6',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🎨</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#2d2d2d', letterSpacing: '-0.5px' }}>Palora</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/login" style={{ padding: '8px 14px', borderRadius: '100px', border: '1.5px solid #e8e4de', color: '#666', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
            Logi sisse
          </Link>
          <Link href="/register" style={{ padding: '8px 14px', borderRadius: '100px', background: '#2d2d2d', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            Alusta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #fff9f0 0%, #f0f4ff 50%, #f9f0ff 100%)',
        padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 40px)',
        textAlign: 'center',
        borderBottom: '1px solid #f0ece6'
      }}>
        <p style={{ color: '#f4a96e', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Kollaboratiivne värvimisrakendus
        </p>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: 800, color: '#2d2d2d', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Värvi koos<br />sõpradega 🌈
        </h1>
        <p style={{ fontSize: 'clamp(15px, 3vw, 18px)', color: '#888', margin: '0 auto 32px', maxWidth: '500px', lineHeight: 1.7 }}>
          Vali illustratsioon, kutsu sõbrad kutselingiga ja värvige koos reaalajas.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ padding: '14px 28px', borderRadius: '100px', background: '#2d2d2d', color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            Alusta tasuta →
          </Link>
          <Link href="/login" style={{ padding: '14px 28px', borderRadius: '100px', background: 'white', color: '#2d2d2d', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1.5px solid #e8e4de' }}>
            Logi sisse
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(40px, 8vw, 80px) 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#2d2d2d', marginBottom: '40px', letterSpacing: '-1px' }}>
          Miks Palora?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {[
            { emoji: '🎨', title: 'Värvid koos', desc: 'Kutsu sõbrad ja värvige sama pilti samaaegselt — näete muutusi reaalajas.' },
            { emoji: '🔒', title: 'Tasuta alustada', desc: '9 tasuta pilti kolmel raskusastmel. Lisa rohkem vaid 1€ tükkidest.' },
            { emoji: '🌸', title: 'Kolm taset', desc: 'Algajast meistrini — lihtsad maastikud, geomeetrilised loomad ja keerulised kompositsioonid.' }
          ].map((f, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid #f0ece6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '14px' }}>{f.emoji}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#2d2d2d', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#2d2d2d', padding: 'clamp(50px, 8vw, 80px) 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: 'white', marginBottom: '14px', letterSpacing: '-1px' }}>
          Valmis alustama? 🎨
        </h2>
        <p style={{ fontSize: '15px', color: '#aaa', marginBottom: '28px' }}>
          Registreerimine võtab alla 30 sekundi
        </p>
        <Link href="/register" style={{ padding: '14px 32px', borderRadius: '100px', background: 'white', color: '#2d2d2d', textDecoration: 'none', fontSize: '15px', fontWeight: 700, display: 'inline-block' }}>
          Alusta tasuta →
        </Link>
      </div>

      {/* Footer */}
      <div style={{ background: '#1a1a1a', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ color: '#555', fontSize: '12px' }}>© 2026 Palora. Kõik õigused kaitstud.</span>
        <span style={{ color: '#555', fontSize: '12px' }}>Notso OÜ</span>
      </div>

    </main>
  )
}
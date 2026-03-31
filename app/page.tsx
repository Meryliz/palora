import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#fdfcfa', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Header */}
      <header style={{
        padding: '0 40px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'white',
        borderBottom: '1px solid #f0ece6',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '28px' }}>🎨</span>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#2d2d2d', letterSpacing: '-0.5px' }}>Palora</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" style={{ padding: '8px 20px', borderRadius: '100px', border: '1.5px solid #e8e4de', color: '#666', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Logi sisse
          </Link>
          <Link href="/register" style={{ padding: '8px 20px', borderRadius: '100px', background: '#2d2d2d', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Alusta tasuta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #fff9f0 0%, #f0f4ff 50%, #f9f0ff 100%)',
        padding: '100px 40px',
        textAlign: 'center',
        borderBottom: '1px solid #f0ece6'
      }}>
        <p style={{ color: '#f4a96e', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
          Kollaboratiivne värvimisrakendus
        </p>
        <h1 style={{ fontSize: '56px', fontWeight: 800, color: '#2d2d2d', margin: '0 0 20px', letterSpacing: '-2px', lineHeight: 1.1 }}>
          Värvi koos<br />sõpradega 🌈
        </h1>
        <p style={{ fontSize: '18px', color: '#888', margin: '0 auto 40px', maxWidth: '500px', lineHeight: 1.7 }}>
          Vali illustratsioon, kutsu sõbrad kutselingiga ja värvige koos reaalajas.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/register" style={{ padding: '16px 36px', borderRadius: '100px', background: '#2d2d2d', color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            Alusta tasuta →
          </Link>
          <Link href="/login" style={{ padding: '16px 36px', borderRadius: '100px', background: 'white', color: '#2d2d2d', textDecoration: 'none', fontSize: '16px', fontWeight: 600, border: '1.5px solid #e8e4de' }}>
            Logi sisse
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 800, color: '#2d2d2d', marginBottom: '60px', letterSpacing: '-1px' }}>
          Miks Palora?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { emoji: '🎨', title: 'Värvid koos', desc: 'Kutsu sõbrad ja värvige sama pilti samaaegselt — näete muutusi reaalajas.' },
            { emoji: '🔒', title: 'Alusta tasuta', desc: '9 tasuta pilti kolmel raskusastmel. Lisa rohkem vaid 1€ tükkidest.' },
            { emoji: '🌸', title: 'Kolm taset', desc: 'Algajast meistrini — lihtsad maastikud, geomeetrilised loomad ja keerulised kompositsioonid.' }
          ].map((f, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #f0ece6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.emoji}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2d2d2d', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#2d2d2d', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
          Valmis alustama? 🎨
        </h2>
        <p style={{ fontSize: '16px', color: '#aaa', marginBottom: '36px' }}>
          Registreerimine võtab alla 30 sekundi
        </p>
        <Link href="/register" style={{ padding: '16px 40px', borderRadius: '100px', background: 'white', color: '#2d2d2d', textDecoration: 'none', fontSize: '16px', fontWeight: 700 }}>
          Alusta tasuta →
        </Link>
      </div>

      {/* Footer */}
      <div style={{ background: '#1a1a1a', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#555', fontSize: '13px' }}>© 2026 Palora. Kõik õigused kaitstud.</span>
        <span style={{ color: '#555', fontSize: '13px' }}>Notso OÜ</span>
      </div>

    </main>
  )
}
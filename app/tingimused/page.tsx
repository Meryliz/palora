import Link from 'next/link'

export default function Tingimused() {
  return (
    <main style={{ minHeight: '100vh', background: '#fdfcfa', fontFamily: 'Segoe UI, sans-serif' }}>
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #f0ece6',
        padding: '0 20px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '24px' }}>🎨</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#2d2d2d' }}>Palora</span>
        </Link>
      </header>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#2d2d2d', marginBottom: '8px' }}>
          Kasutustingimused ja tagastuspoliitika
        </h1>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '40px' }}>Viimati uuendatud: aprill 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2d2d2d', marginBottom: '12px' }}>1. Teenuse kirjeldus</h2>
            <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>
              Palora on kollaboratiivne värvimisrakendus, mille kaudu kasutajad saavad värvida digitaalseid illustratsioone üksi või koos sõpradega reaalajas. Teenust pakub Notso OÜ.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2d2d2d', marginBottom: '12px' }}>2. Digitaalsete toodete ostmine</h2>
            <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>
              Paloras saab osta digitaalseid illustratsioone värvimiseks. Isiklik pilt maksab 1€ ja grupi pilt 3€ (kuni 10 liikmele). Pärast edukat makset avaneb pilt kohe kasutamiseks.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2d2d2d', marginBottom: '12px' }}>3. Tagastuspoliitika</h2>
            <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>
              Kuna tegemist on digitaalse tootega, mis muutub kättesaadavaks kohe pärast ostu sooritamist, <strong>ei ole tagastamine võimalik</strong> pärast pildi avamist ja kasutamist. Erandkorras (nt topeltostu või tehniline viga) palume võtta ühendust aadressil <strong>info@palora.ee</strong> ja lahendame probleemi 3 tööpäeva jooksul.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2d2d2d', marginBottom: '12px' }}>4. Kasutajakonto</h2>
            <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>
              Kasutaja vastutab oma konto turvalisuse eest. Palora ei vastuta volitamata juurdepääsu eest, mis tuleneb kasutaja hooletusest. Konto kustutamiseks palume võtta ühendust info@palora.ee.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2d2d2d', marginBottom: '12px' }}>5. Grupid</h2>
            <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>
              Grupp on mõeldud kuni 10 liikmele. Grupi ostud kehtivad kõigile grupiliikmetele. Grupi looja vastutab kutselingi jagamise eest.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2d2d2d', marginBottom: '12px' }}>6. Kontakt</h2>
            <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>
              Küsimuste korral kirjuta: <strong>info@palora.ee</strong><br />
              Notso OÜ, Eesti
            </p>
          </section>

        </div>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #f0ece6' }}>
          <Link href="/" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            ← Tagasi avalehele
          </Link>
        </div>
      </div>
    </main>
  )
}
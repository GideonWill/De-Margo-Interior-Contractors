import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function Seo({ title, description, image, type }) {
  const loc = window.location.pathname
  const siteUrl = window.location.origin
  const fullUrl = siteUrl + loc
  const metaImage = image ? (image.startsWith('http') ? image : siteUrl + image) : siteUrl + '/assets/Demargo%20Logo.jpg'

  useEffect(() => {
    document.title = title ? title + ' • Demargo Interior Contractors' : 'Demargo Interior Contractors | Interior Design, Curtains & 3D Rendering in Ghana'
  }, [title])

  return (
    <Helmet>
      <meta name="description" content={description || 'Discover top-quality interior design, curtains, blinds, and 3D rendering services from Demargo Interior Contractors. Transform your space with elegance and creativity.'} />

      {/* Open Graph */}
      <meta property="og:site_name" content="Demargo Interior Contractors" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={title || 'Demargo Interior Contractors'} />
      <meta property="og:description" content={description || 'Discover top-quality interior design, curtains, blinds, and 3D rendering services from Demargo Interior Contractors.'} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'Demargo Interior Contractors'} />
      <meta name="twitter:description" content={description || 'Discover top-quality interior design, curtains, blinds, and 3D rendering services from Demargo Interior Contractors.'} />
      <meta name="twitter:image" content={metaImage} />

      <link rel="canonical" href={fullUrl} />
    </Helmet>
  )
}

// Shared services list used across Services page and footer
const allServices = [
  {
    title: 'Interior Design',
    desc: 'We create custom‑designed interiors that reflect your lifestyle, personality, and space needs.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18" /><path d="M6 7v13" /><path d="M18 7v13" /><path d="M6 20h12" /><path d="M9 7V4h6v3" /></svg>
    )
  },
  {
    title: 'Home Renovation',
    desc: 'From kitchen upgrades to full remodels, we handle all aspects of home renovation.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9" /><path d="M9 21V9h6v12" /></svg>
    )
  },
  {
    title: '3D Rendering and Visualization',
    desc: 'Visualize your interior project in real‑time form with high‑quality 3D renders.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /></svg>
    )
  },
  {
    title: 'Curtains and Blinds Installation',
    desc: 'Fabric selection, measurement, and flawless installation for homes and offices.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18" /><path d="M4 3v18" /><path d="M8 3v18" /><path d="M12 3v18" /><path d="M16 3v18" /><path d="M20 3v18" /></svg>
    )
  },
  {
    title: 'Smart Home Installation',
    desc: 'Lighting automation, security, and remote‑controlled systems tailored to your lifestyle.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l7 7v11H5V9l7-7z" /><path d="M9 13h6v6H9z" /></svg>
    )
  },
  {
    title: 'POP Ceiling Designs',
    desc: 'Modern ceiling finishes that add depth, beauty, and sophistication to any room.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18" /><path d="M6 10h12" /><path d="M9 13h6" /></svg>
    )
  },
  {
    title: 'Painting',
    desc: 'Professional interior and exterior painting using high‑quality materials and techniques.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3h10v6H3z" />
        <path d="M13 5h8" />
        <path d="M13 8h6" />
        <path d="M7 9v10a2 2 0 002 2h2a2 2 0 002-2V9" />
      </svg>
    )
  },
  {
    title: 'Tiling',
    desc: 'Durable, stylish floors and wall tiling for bathrooms, kitchens, offices and showrooms.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
    )
  },
  {
    title: 'Cleaning Services',
    desc: 'Post‑construction and deep cleaning to ensure your space is spotless, safe, and move‑in ready.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18" /><path d="M6 12V6a3 3 0 013-3h6a3 3 0 013 3v6" /><path d="M6 12l2 9h8l2-9" /></svg>
    )
  }
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const linkClass = ({ isActive }) =>
    `px-2 py-1 rounded transition-colors ${isActive ? 'text-demargo-orange' : 'hover:text-demargo-orange'}`
  return (
    <header className={`w-full sticky top-0 z-40 transition ${scrolled ? 'bg-white/90 backdrop-blur shadow' : 'bg-white/70 backdrop-blur'}`}>
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/Demargo%20Logo.jpg" alt="Demargo" className="h-8 w-auto" />
        </Link>
        <button aria-label="Open menu" className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded border text-gray-700" onClick={() => setOpen(o => !o)}>
          <span className="sr-only">Toggle navigation</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M3.75 6.75a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25c0-.414.336-.75.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm.75 4.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15z" clipRule="evenodd" />
          </svg>
        </button>
        <ul className="hidden md:flex gap-6 items-center text-sm">
          <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
          <li><NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink></li>
          <li><NavLink to="/services" className={linkClass}>Services</NavLink></li>
          <li><NavLink to="/fabrics" className={linkClass}>Fabric Display</NavLink></li>
          <li><NavLink to="/clientele" className={linkClass}>Clientele</NavLink></li>
          <li><NavLink to="/testimonials" className={linkClass}>Testimonials</NavLink></li>
          <li><NavLink to="/awards" className={linkClass}>Awards</NavLink></li>
          <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => `px-3 py-2 rounded-md text-white transition-colors ${isActive ? 'bg-demargo-blue' : 'bg-demargo-orange hover:opacity-90'}`}>Contact</NavLink></li>
        </ul>
      </nav>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <ul className="grid gap-2 text-sm">
              <li><NavLink onClick={() => setOpen(false)} to="/" className={linkClass}>Home</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/portfolio" className={linkClass}>Portfolio</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/services" className={linkClass}>Services</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/fabrics" className={linkClass}>Fabric Display</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/clientele" className={linkClass}>Clientele</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/testimonials" className={linkClass}>Testimonials</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/awards" className={linkClass}>Awards</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/about" className={linkClass}>About</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/contact" className={({ isActive }) => `px-3 py-2 rounded-md text-white inline-block ${isActive ? 'bg-demargo-blue' : 'bg-demargo-orange hover:opacity-90'}`}>Contact</NavLink></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}

function Home() {
  const videoRef = useRef(null)
  const revealRefs = useRef([])
  useEffect(() => {
    const v = videoRef.current
    if (!v || !(v instanceof HTMLVideoElement)) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) v.play().catch(() => { })
        else v.pause()
      })
    }, { threshold: 0.25 })
    obs.observe(v)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('is-visible')
      })
    }, { threshold: 0.15 })
    revealRefs.current.forEach((el) => el && revealObs.observe(el))
    return () => revealObs.disconnect()
  }, [])

  // Simple parallax for hero images and scroll-triggered background shift
  useEffect(() => {
    const onScroll = () => {
      const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'))
      const y = window.scrollY
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const offset = (rect.top + window.scrollY)
        const delta = Math.max(-40, Math.min(40, (y - offset) * 0.08))
        el.style.transform = `translateY(${delta}px) scale(1.05)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main>
      <Seo
        title="Demargo Interior Contractors | Interior Design, Curtains & 3D Rendering in Ghana"
        description="Discover top-quality interior design, curtains, blinds, and 3D rendering services from Demargo Interior Contractors. Transform your space with elegance and creativity."
        image="/assets/Executive%20Dining%20Experience.jpg"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Demargo Interior Contractors',
          url: typeof window !== 'undefined' ? window.location.origin : 'https://demargointerior.com',
          image: 'https://demargointerior.com/assets/hero%201.jpg',
          telephone: '+233546478040',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Gbawe',
            addressRegion: 'Greater Accra',
            addressCountry: 'GH'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 5.5781,
            longitude: -0.3065
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '17:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: 'Saturday',
              opens: '08:00',
              closes: '16:00'
            }
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5',
            reviewCount: '50'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Interior Design Services',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interior Design' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Renovation' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Curtains and Blinds' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '3D Rendering' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Smart Home Installation' } }
            ]
          },
          sameAs: [
            'https://www.facebook.com/share/1Jui7wFk7G/?mibextid=wwXIfr',
            'https://instagram.com/demargo_blinds_curtains',
            'https://www.linkedin.com/in/de-margo-interior-contractors-5a6153262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
          ],
          areaServed: ['Ghana', 'Accra', 'Kumasi', 'Tema', 'Takoradi', 'Cape Coast', 'Africa'],
          priceRange: '$$'
        })}</script>
      </Helmet>
      {/* HERO - Updated to Serene Master Retreat with Demargo theme */}
      <section className="relative h-[82vh] md:h-[90vh] flex items-center overflow-hidden bg-slate-900">
        <img
          src="/assets/Executive%20Dining%20Experience.jpg"
          alt="Luxury interior hero"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.8]"
          ref={el => (revealRefs.current[10] = el)}
          style={{ transform: 'translateY(0px) scale(1.05)' }}
          data-parallax
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-demargo-blue/60 via-black/40 to-demargo-orange/60" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 items-center w-full">
          <div className="animate-fade-in">
            <div className="badge-glass mb-4"><span>★</span><span>Premium Interior Design Since 2018</span></div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05]">
              <span className="text-white">RELIABLE</span><br />
              <span className="text-white">HIGH CLASS</span><br />
              <span className="text-demargo-orange">GREAT AMBIENCE</span>
            </h1>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="btn-primary">Start Your Project</Link>
              <Link to="/portfolio" className="btn-ghost">View Portfolio</Link>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4">
            <div className="panel-glass p-6 text-white">
              <div className="text-3xl font-extrabold">2000+</div>
              <div className="text-white/80">Projects</div>
            </div>
            <div className="panel-glass p-6 text-white">
              <div className="text-3xl font-extrabold">7+</div>
              <div className="text-white/80">Years</div>
            </div>
            <div className="panel-glass p-6 text-white">
              <div className="font-semibold mb-2">Why Choose Demargo?</div>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-center gap-2"><span className="text-demargo-orange">●</span>Premium Quality Materials</li>
                <li className="flex items-center gap-2"><span className="text-demargo-orange">●</span>Expert Installation Team</li>
                <li className="flex items-center gap-2"><span className="text-demargo-orange">●</span>Custom Design Solutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CAPTION BETWEEN HERO SECTIONS */}
      <section className="py-8 bg-white">
        <p className="text-center text-2xl md:text-4xl text-gray-900 font-extrabold tracking-wide font-serif">
          An Honourable Award from the Ghana Armed Forces (GAP)
        </p>
      </section>

      {/* AWARD HERO - Classy spotlight section (moved below main hero) */}
      <section ref={el => revealRefs.current[5] = el} className="reveal relative h-[76vh] md:h-[88vh] flex items-center overflow-hidden">
        <img
          src="/assets/award.jpg"
          alt="Award Certificate - Ghana Armed Forces Staff College"
          className="absolute inset-0 w-full h-full object-cover object-center"
          ref={el => (revealRefs.current[11] = el)}
          style={{ transform: 'translateY(0px) scale(1.05)' }}
          data-parallax
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-demargo-blue/40 to-demargo-orange/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center w-full">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm">
              <span>🏆</span>
              <span className="tracking-wide">Award & Recognition</span>
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight max-w-2xl">
              Excellence in Interior Design Services
            </h2>
            <p className="mt-4 text-white/85 max-w-xl">
              Honored by the Ghana Armed Forces Staff College for outstanding interior design and renovation services.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/awards" className="btn-primary btn-elevate">View Award</Link>
              <Link to="/contact" className="btn-ghost btn-elevate">Start Your Project</Link>
            </div>
            <div className="mt-6 flex items-center gap-3 text-white/80">
              <img src="/assets/GAF.jpg" alt="GAF Logo" className="w-10 h-10 rounded-full object-contain bg-white/90 p-1" />
              <div className="text-sm">
                <div className="font-semibold">Ghana Armed Forces Staff College</div>
                <div>2024 • Government Service Excellence</div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="panel-glass p-3 rounded-2xl max-w-md w-full">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black/20">
                <img src="/assets/award.jpg" alt="Award Certificate" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SNAPSHOT SECTION (second screenshot) */}
      <section ref={el => revealRefs.current[0] = el} className="reveal max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-demargo-orange font-semibold tracking-wide">ABOUT DEMARGO</div>
            <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">Crafting Dreams Into <span className="text-demargo-blue">Reality</span></h2>
            <p className="mt-4 text-gray-700">Since 2018, we've been transforming spaces with premium interior design solutions. Our expertise in curtains, lighting, and bedroom styling has made us the preferred choice for discerning clients across the region.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-orange-50">
                <div className="text-3xl font-extrabold text-demargo-orange">2000+</div>
                <div className="text-gray-700">Projects Completed</div>
              </div>
              <div className="p-6 rounded-2xl bg-blue-50">
                <div className="text-3xl font-extrabold text-demargo-blue">7+</div>
                <div className="text-gray-700">Years of Excellence</div>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/about" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-demargo-blue text-white">Learn More About Us
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
          <div className="panel-glass p-2 card-glow">
            <img src="/assets/hero%201.jpg" alt="About Demargo" className="aspect-video rounded-2xl w-full h-auto object-cover overflow-hidden" />
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW (third screenshot tone) */}
      <section ref={el => revealRefs.current[1] = el} className="reveal max-w-6xl mx-auto px-4 py-16">
        <div className="text-demargo-orange font-semibold text-center">OUR SERVICES</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mt-2">Comprehensive Interior Solutions</h2>
        <p className="text-center text-gray-600 mt-3 max-w-3xl mx-auto">From custom curtains to sophisticated lighting, we offer complete interior design services that transform your space into a masterpiece of luxury and functionality.</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Living Room Setting', img: '/assets/hero%20pic.jpg' },
            { title: 'Lighting System', img: '/assets/Lighting%20design.jpg' },
            { title: 'Bedroom Styling', img: '/assets/custom%20curtains.jpg' },
            { title: '3D Rendering', img: '/assets/3D%20Rendering.jpg' }
          ].map((s, i) => (
            <Link to="/portfolio" key={i} className="rounded-2xl overflow-hidden bg-white border card-glow block">
              <img src={s.img} alt={s.title} className="w-full h-64 object-cover" />
            </Link>
          ))}
        </div>
      </section>

      {/* HOME FULL-WIDTH VIDEO SECTION (hero-sized) */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center overflow-hidden mt-4">
        <VideoReveal src="/assets/video.mp4" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h2 className="text-white text-3xl md:text-5xl font-extrabold">Experience Demargo in Motion</h2>
          <p className="text-white/80 mt-2 max-w-xl">Craft, detail and ambience captured from our recent projects.</p>
        </div>
      </section>



      {/* PORTFOLIO SHOWCASE (three blocks) */}
      <section ref={el => revealRefs.current[2] = el} className="reveal max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center gap-2 text-demargo-orange">
          <span>👁️</span>
          <span className="font-semibold">PORTFOLIO SHOWCASE</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mt-2">Recent Projects</h2>
        <p className="text-center text-gray-600 mt-3 max-w-4xl mx-auto">Explore our latest interior design projects that showcase our commitment to excellence, innovation, and the art of creating beautiful spaces.</p>
        <div className="mt-10 space-y-14">
          {[
            { img: '/assets/Contemporary%20living%20suite.jpg', tag: 'RELIABLE', title: 'Contemporary Living Suite', idx: 1 },
            { img: '/assets/Serene%20Master%20Retreat.jpg', tag: 'HIGH CLASS INTERIOR', title: 'Serene Master Retreat', idx: 2 },
            { img: '/assets/Executive%20Dining%20Experience.jpg', tag: 'TOP-NOTCH DELIVERY', title: 'Executive Dining Experience', idx: 3 },
            { img: '/assets/Modern%20Dining%20Experience.jpg', tag: 'LUXURY DINING', title: 'Modern Dining Experience', idx: 4 },
            { img: '/assets/e2.jpg', tag: 'PREMIUM INTERIOR', title: 'Elegant Living Space', idx: 5 }
          ].map((item, i) => (
            <div key={i} className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 ? '' : 'md:flex-row-reverse'}`}>
              <div className="panel-glass p-2 card-glow order-1 md:order-none">
                <div className="aspect-[16/11] rounded-2xl overflow-hidden bg-slate-200 relative">
                  <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute left-4 top-4 px-4 py-2 rounded-full bg-demargo-orange text-white font-semibold">2024</div>
                </div>
              </div>
              <div className="order-2 md:order-none">
                <div className="text-demargo-orange font-semibold">{item.tag}</div>
                <h3 className="text-3xl md:text-4xl font-extrabold mt-2">{item.title}</h3>
                <p className="mt-3 text-gray-700">{i === 0 ? 'Stunning modern living space featuring sophisticated furniture arrangements, premium textiles, and carefully curated lighting that creates an atmosphere of understated luxury.' : i === 1 ? 'Elegant bedroom sanctuary featuring luxury bedding, custom window treatments, and thoughtful lighting design that promotes rest and relaxation.' : i === 2 ? 'Sophisticated dining space showcasing modern furniture, elegant ceiling treatments, and premium finishes that create the perfect atmosphere for memorable gatherings.' : i === 3 ? 'Contemporary dining room featuring modern furniture, elegant lighting fixtures, and premium finishes that create an atmosphere of luxury and sophistication.' : 'Spacious living area with modern furniture arrangements, premium lighting design, and thoughtful interior styling that creates a welcoming and elegant atmosphere.'}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(i === 0 ? ['Modern Furniture', 'Premium Textiles', 'Ambient Lighting'] : i === 1 ? ['Custom Bedding', 'Window Treatments', 'Mood Lighting'] : i === 2 ? ['Modern Dining Set', 'Ceiling Design', 'Premium Finishes'] : i === 3 ? ['Dining Furniture', 'Lighting Design', 'Premium Materials'] : ['Modern Seating', 'Lighting Systems', 'Interior Styling']).map((t, j) => (
                    <span key={j} className="tag-pill">{t}</span>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/portfolio" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-demargo-blue text-white hover:opacity-90 active:scale-[.98]">View Full Project
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO HERO SECTION */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center overflow-hidden mt-4">
        <VideoReveal src="/assets/v17.mp4" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h2 className="text-white text-3xl md:text-5xl font-extrabold">Experience Our Latest Work</h2>
          <p className="text-white/80 mt-2 max-w-xl">Watch our newest project showcase featuring cutting-edge interior design and premium craftsmanship.</p>
        </div>
      </section>

      {/* TESTIMONIALS DARK SECTION */}
      <section ref={el => revealRefs.current[3] = el} className="reveal bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-center text-4xl md:text-5xl font-extrabold">What Our Clients Say</h2>
          <p className="text-center text-white/80 mt-3 max-w-3xl mx-auto">Don't just take our word for it. Here's what our satisfied clients have to say about their Demargo experience.</p>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {[{ n: 'Adom Bright', r: 'Homeowner', q: 'Demargo transformed our living space beyond our expectations. The attention to detail and quality of work is exceptional.' }, { n: 'Ayi Homes', r: 'Developer', q: 'Professional, timely, and absolutely stunning results. Our spaces now reflect the quality of our brand.' }].map((t, i) => (
              <figure key={i} className="panel-glass p-6 text-white">
                <div className="text-demargo-orange mb-2">★★★★★</div>
                <blockquote className="text-white/90">“{t.q}”</blockquote>
                <figcaption className="mt-4 text-sm text-white/80">{t.n}<span className="mx-1">•</span>{t.r}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={el => revealRefs.current[4] = el} className="reveal max-w-6xl mx-auto px-4 pb-16">
        <div className="cta-card">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">Ready to Transform Your Space?</h3>
            <p className="text-gray-600 mt-1">Book a free site visit and consultation today.</p>
          </div>
          <Link to="/contact" className="btn-primary">Get Started</Link>
        </div>
      </section>
    </main>
  )
}

function Services() {
  const heroImg = '/assets/bedroom%20styling.jpg'
  // uses shared allServices defined above

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Services" description="Detailed list of Demargo services including curtains, renovations, woodwork and smart home systems." />

      {/* Top hero row */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-orange-50 rounded-2xl p-6 md:p-10">
          <div className="text-sm text-gray-600">Demargo Services</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 leading-tight">
            <span className="text-demargo-orange">Interior Design</span>
            <span className="text-gray-800">, </span>
            <span className="text-demargo-blue">Renovation & More in Ghana</span>
          </h1>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <img src={heroImg} alt="Services hero" className="w-full h-64 md:h-72 object-cover" />
        </div>
      </div>

      {/* Intro and first row */}
      <div className="mt-10 grid md:grid-cols-3 gap-6 items-start">
        <article className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-sm text-gray-500">Demargo Services</div>
          <h2 className="text-2xl font-semibold mt-2">Our Services</h2>
          <p className="text-gray-700 mt-3">We provide expert interior design and renovation services across Ghana. From homes to offices, we create beautiful, functional spaces with style and precision — serving Accra, Kumasi, Tema, Takoradi, Cape Coast, and beyond.</p>
        </article>
        {allServices.slice(0, 2).map((s, i) => (
          <article key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-demargo-blue mb-2">{s.icon}</div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </article>
        ))}
      </div>

      {/* Remaining grid */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {allServices.slice(2, 8).map((s, i) => (
          <article key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-demargo-blue mb-2">{s.icon}</div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </article>
        ))}
      </div>

      {/* Cleaning full width */}
      <div className="mt-6">
        {allServices.slice(8, 9).map((s, i) => (
          <article key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-demargo-blue mb-2">{s.icon}</div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function InteriorDesign() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo
        title="Interior Design Services in Ghana | Demargo Interior Contractors"
        description="Premium interior design services in Ghana. Space planning, material selection, lighting, and bespoke styling tailored to homes and offices."
      />
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold">Interior Design Services</h1>
          <p className="mt-4 text-gray-700">We design beautiful, functional spaces that reflect your lifestyle and brand. From concept to completion, our team manages space planning, finishes, lighting, and styling for consistent quality delivery.</p>
          <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
            {[
              'Space planning & layout optimization',
              'Material & finish selection',
              'Lighting design & ambiance',
              'Custom curtains & blinds',
              'Furniture sourcing & styling',
              'Project management'
            ].map((b, i) => (
              <li key={`id-b-${i}`} className="p-3 rounded-lg bg-orange-50">{b}</li>
            ))}
          </ul>
          <div className="mt-6">
            <Link to="/contact" className="btn-primary">Book a Consultation</Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow">
          <img src="/assets/Contemporary%20living%20suite.jpg" alt="Interior design in Ghana" className="w-full h-72 object-cover" />
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {allServices.filter(s => ['Interior Design', 'Curtains and Blinds Installation', 'Lighting Design'].includes(s.title)).map((s, i) => (
          <article key={`id-s-${i}`} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-demargo-blue mb-2">{s.icon}</div>
            <h2 className="font-semibold">{s.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Rendering3D() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo
        title="3D Rendering in Ghana | Interior Visualization by Demargo"
        description="High‑quality 3D interior rendering and visualization in Ghana. Preview designs, materials, and lighting before build."
      />
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-2xl overflow-hidden shadow">
          <img src="/assets/d2.jpg" alt="3D interior rendering" className="w-full h-72 object-cover" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold">3D Rendering & Visualization</h1>
          <p className="mt-4 text-gray-700">See your space before construction. We create photorealistic 3D visuals for faster approvals, accurate budgeting, and confident decision‑making.</p>
          <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
            {[
              'Photoreal interior renders',
              'Material & colorway variations',
              'Lighting simulations',
              'Multiple viewpoint options',
              'Fast iterations',
              'Handover-ready assets'
            ].map((b, i) => (
              <li key={`r-b-${i}`} className="p-3 rounded-lg bg-blue-50">{b}</li>
            ))}
          </ul>
          <div className="mt-6">
            <Link to="/contact" className="btn-primary">Request a Rendering</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {allServices.filter(s => s.title === '3D Rendering and Visualization').map((s, i) => (
          <article key={`rd-s-${i}`} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-demargo-blue mb-2">{s.icon}</div>
            <h2 className="font-semibold">{s.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Fabrics() {
  const [lightbox, setLightbox] = useState({ open: false, src: '', kind: 'image' })
  const openLightbox = (src) => setLightbox({ open: true, src, kind: 'image' })
  const closeLightbox = () => setLightbox({ open: false, src: '', kind: 'image' })
  useEffect(() => {
    if (!lightbox.open) return
    const onKeyDown = (e) => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox.open])
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Fabric Display" description="Browse Demargo's curated fabric samples for curtains and upholstery." />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-center">
        <span className="text-demargo-orange">Fabric</span> <span className="text-demargo-blue">Display</span>
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Browse a curated selection of premium fabrics. Tap any tile to preview in a larger view.</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[
          { file: '1.png', code: 'MILAN-7' },
          { file: '2.png', code: '8021-04' },
          { file: '3.png', code: 'MILAN-9' },
          { file: '4.png', code: '8021-05' },
          { file: '5.png', code: 'MILAN-10' },
          { file: '6.png', code: '8021-09' }
        ].map((f, i) => (
          <figure key={i} className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100">
            <button className="relative w-full block" onClick={() => openLightbox(`/assets/${f.file}`)}>
              <img src={`/assets/${f.file}`} alt={`Fabric ${f.code}`} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </button>
            <figcaption className="p-3 text-sm flex items-center justify-between bg-slate-50 border-t">
              <span className="font-medium">Fabric Code</span>
              <span className="px-2 py-1 rounded bg-orange-50 text-demargo-orange text-xs">{f.code}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="text-center mt-8">
        <a
          href="https://www.canva.com/design/DAGr_fyK4CQ/V2rFYccaNyHAbb6TvhfDQw/view?utm_content=DAGr_fyK4CQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h15acb9d221"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-demargo-blue text-white hover:opacity-90"
        >
          View Full Fabric Catalog
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
        </a>
      </div>

      {lightbox.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-xl">
              <img src={lightbox.src} alt="preview" className="w-full h-[70vh] object-contain bg-black" />
            </div>
            <div className="mt-3 flex justify-center">
              <button onClick={closeLightbox} className="inline-flex px-4 py-2 rounded-md bg-white text-gray-800 shadow">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function Clientele() {
  const governmentProjects = [
    { name: 'Flagstaff House', img: '/assets/flagstaff%20house.jpg', category: 'Government' },
    { name: 'Narcotics Control Commission', img: '/assets/Narcotics%20Control%20Commission.png', category: 'Government' },
    { name: 'Ghana Armed Forces', img: '/assets/GAF.jpg', category: 'Government' },
  ]

  const residentialProjects = [
    { name: 'Ayi Mensah Park by Indigo Homes', img: '/assets/Ayi%20Mensah%20Park%20by%20Indigo%20Homes.jpeg', category: 'Residential' },
    { name: 'Bel Rose Place', img: '/assets/Bel%20Rose%20Place.jpeg', category: 'Residential' },
    { name: 'Cantoment Gardens', img: '/assets/Cantoment%20Gardens.jpg', category: 'Residential' },
    { name: 'City Galleria', img: '/assets/City%20Galleria.jpeg', category: 'Residential' },
    { name: 'Contemporary living suite', img: '/assets/Contemporary%20living%20suite.jpg', category: 'Residential' },
    { name: 'Embassy Gardens', img: '/assets/Embassy%20Gardens.jpg', category: 'Residential' },
    { name: 'Harvey Terraces', img: '/assets/Harvey%20Terraces.jpeg', category: 'Residential' },
    { name: 'Loxwood House', img: '/assets/Loxwood%20House.jpg', category: 'Residential' },
    { name: 'Lindsay Square', img: '/assets/Lindsay%20Square.jpg', category: 'Residential' },
    { name: 'Nova by Devtraco Plus', img: '/assets/Nova%20by%20Devtraco%20Plus.jpg', category: 'Residential' },
    { name: 'Oyarifa Park by Indigo Homes', img: '/assets/Oyarifa%20Park%20by%20Indigo%20Homes.jpeg', category: 'Residential' },
    { name: 'Silicon Valley', img: '/assets/Silicon%20Valley.jpeg', category: 'Residential' },
    { name: 'The Lennox Apartments', img: '/assets/The%20Lennox%20Apartments.jpg', category: 'Residential' },
    { name: 'The Palms - Kaybee Gardens', img: '/assets/The%20Palms%20-%20Kaybee%20Gardens.jpeg', category: 'Residential' },
    { name: 'The Signature Apartments', img: '/assets/The%20Signature%20Apartments.jpg', category: 'Residential' },
    { name: 'Tribute House', img: '/assets/Tribute%20House.jpeg', category: 'Residential' },
    { name: 'Ashanti Gardens', img: '/assets/Ashanti%20Gardens.jpeg', category: 'Residential' },
  ]

  const commercialProjects = [
    { name: 'Holiday Inn Hotel', img: '/assets/Holiday%20Inn%20Hotel.jpg', category: 'Commercial' },
    { name: 'Williot Constructions', img: '/assets/Williot%20Constructions.png', category: 'Commercial' },
  ]

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Clientele" description="Some of the clients Demargo Interior Contractors has served." />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-center">
        <span className="text-demargo-orange">Our</span> <span className="text-demargo-blue">Esteemed Clients</span>
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">A selection of brands, residences, and developments we've had the privilege to style and fit with premium interior solutions.</p>

      {/* Government Projects */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          <span className="text-demargo-orange">Government</span> <span className="text-demargo-blue">Projects</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {governmentProjects.map((c, i) => (
            <figure key={i} className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100 hover:-translate-y-0.5">
              <img src={c.img} alt={c.name} className="w-full aspect-[4/3] object-cover" />
              <figcaption className="px-4 py-3 text-sm text-gray-800 font-medium text-center bg-slate-50 border-t">{c.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Residential Projects */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          <span className="text-demargo-orange">Residential</span> <span className="text-demargo-blue">Projects</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {residentialProjects.map((c, i) => (
            <figure key={i} className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100 hover:-translate-y-0.5">
              <img src={c.img} alt={c.name} className="w-full aspect-[4/3] object-cover" />
              <figcaption className="px-4 py-3 text-sm text-gray-800 font-medium text-center bg-slate-50 border-t">{c.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Commercial Projects */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          <span className="text-demargo-orange">Commercial</span> <span className="text-demargo-blue">Projects</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {commercialProjects.map((c, i) => (
            <figure key={i} className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100 hover:-translate-y-0.5">
              <img src={c.img} alt={c.name} className="w-full aspect-[4/3] object-cover" />
              <figcaption className="px-4 py-3 text-sm text-gray-800 font-medium text-center bg-slate-50 border-t">{c.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="About" description="About Demargo Interior Contractors - mission, vision, and company story." />
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">
        <span className="text-demargo-orange">About</span> <span className="text-demargo-blue">Demargo</span>
      </h1>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-2xl overflow-hidden">
            <img src="/assets/hero%201.jpg" alt="About main" className="w-full h-64 md:h-80 object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="/assets/custom%20curtains.jpg" alt="Curtains" className="w-full h-40 md:h-48 object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="/assets/Lighting%20design.jpg" alt="Lighting" className="w-full h-40 md:h-48 object-cover" />
          </div>
        </div>
        <div>
          <p className="text-gray-700">Demargo Interior Contractors is a leading interior decoration and fitting company based in Ghana, serving clients across Africa. We deliver high-quality bespoke curtains and blinds, comprehensive renovation projects, woodwork and smart home integrations focused on craftsmanship and exceptional service.</p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Mission Statement</h2>
            <p className="mt-2 text-gray-700">At De Margo Interior contractors, we are dedicated to transforming spaces into timeless environments that reflect the unique identities, lifestyles, and aspirations of our clients. Through innovative design, exceptional craftsmanship, and a commitment to sustainability, we create interiors that are both beautiful and functional elevating everyday living through thoughtful detail and enduring quality.</p>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {['Insured & Certified', 'Dedicated Project Managers', 'Trusted Vendor Network', 'After‑service Support'].map((b, i) => (
              <div key={i} className="p-4 rounded-lg bg-gradient-to-r from-demargo-orange/10 to-demargo-blue/10 border">{b}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">Leadership</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: 'Mr Jeffery Ofosuhene Apenteng', role: 'Chief Executive Officer', img: '/assets/Mr%20Jeffery%20Ofosu-Hene%20Appenteng.jpg' },
            { name: 'Mrs Barbara Apenteng', role: 'Chief Operating Officer', img: '/assets/Mrs%20Babara%20Ofusu-Hene%20Appenteng.jpg' },
            { name: 'Blessing Kesinornu', role: 'Managing Director', img: '/assets/Kessy.jpg' },
            { name: 'George Nettey', role: 'Head of Media', img: '/assets/George.jpg' },
            { name: 'Micheal Martey', role: 'Head of Installation', img: '/assets/MDK.jpg' },
            { name: 'Samuel Nettey', role: 'Head of Measurements', img: '/assets/Omar.jpg' }
          ].map((m, i) => (
            <figure key={i} className="rounded-xl overflow-hidden bg-white text-center shadow-sm">
              <img
                src={m.img}
                alt={m.name}
                className={`w-full h-60 md:h-52 bg-slate-100 ${i === 0 ? 'object-contain md:object-cover' :
                  i === 5 ? 'object-contain' :
                    'object-cover'
                  }`}
                style={
                  i === 0 || i === 5 ? {} :
                    i === 1 ? { objectPosition: 'center 20%' } : // Mrs Babara
                      i === 2 ? { objectPosition: 'center 25%' } : // Blessing
                        i === 3 ? { objectPosition: 'center 30%' } : // George
                          { objectPosition: 'center 25%' } // Micheal
                }
              />
              <figcaption className="px-3 py-2">
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-gray-600">{m.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}



function Awards() {
  const [lightbox, setLightbox] = useState({ open: false, src: '', award: null })
  const openLightbox = (src, award) => setLightbox({ open: true, src, award })
  const closeLightbox = () => setLightbox({ open: false, src: '', award: null })
  useEffect(() => {
    if (!lightbox.open) return
    const onKeyDown = (e) => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox.open])

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Awards & Citations" description="Recognition and awards received by Demargo Interior Contractors for excellence in interior design and construction." />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-center">
        <span className="text-demargo-orange">Awards &</span> <span className="text-demargo-blue">Citations</span>
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">Recognition for our commitment to excellence in interior design, craftsmanship, and client satisfaction across Ghana and Africa.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Excellence in Interior Design Services",
            organization: "Ghana Armed Forces Staff College",
            year: "2024",
            description: "Presented in appreciation of generous support to the Ghana Armed Forces Command and Staff College, recognizing meaningful contribution and service.",
            category: "Government Service Excellence",
            logo: "/assets/GAF.jpg",
            awardImage: "/assets/award.jpg",
            extraImages: ["/assets/awards%20GAF.jpg"]
          }
        ].map((award, i) => (
          <div key={i} className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => openLightbox(award.awardImage, award)}>
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${award.awardImage})` }} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="text-demargo-orange text-sm font-semibold">{award.category}</div>
                <div className="text-gray-500 text-sm">{award.year}</div>
              </div>
              <div className="flex items-center mb-4">
                <img src={award.logo} alt={award.organization} className="w-12 h-12 object-contain mr-3" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{award.title}</h3>
                  <div className="text-demargo-blue font-semibold">{award.organization}</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{award.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gradient-to-r from-demargo-orange/10 to-demargo-blue/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Our Commitment to Excellence</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-demargo-orange mb-2">7+</div>
            <div className="text-gray-700">Years of Excellence</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-demargo-blue mb-2">2000+</div>
            <div className="text-gray-700">Projects Completed</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-demargo-orange mb-2">100%</div>
            <div className="text-gray-700">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {lightbox.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y">
              {/* Award Images on Left */}
              <div className="w-full md:w-1/2 p-4 bg-gradient-to-br from-slate-50 to-white">
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4 items-start min-w-0 max-h-[80vh] md:max-h-[85vh] overflow-y-auto pr-1">
                  {lightbox.award?.extraImages?.map((img, idx) => (
                    <div key={idx} className="w-full rounded-lg bg-white shadow flex items-center justify-center">
                      <img src={img} alt="Award Additional" className="w-full h-auto object-contain" />
                    </div>
                  ))}
                  <div className="w-full rounded-lg bg-white shadow flex items-center justify-center">
                    <img src={lightbox.src} alt="Award Certificate" className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              {/* Description on Right */}
              {lightbox.award && (
                <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-white to-slate-50 flex flex-col justify-center relative">
                  <button
                    onClick={closeLightbox}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="space-y-6">
                    <div>
                      <div className="text-demargo-orange text-xs font-bold uppercase tracking-wider mb-3">{lightbox.award.category}</div>
                      <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">{lightbox.award.title}</h2>
                      <div className="text-demargo-blue text-lg font-bold mb-6">{lightbox.award.organization}</div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-demargo-orange/10 to-demargo-blue/10 rounded-lg">
                        <span className="text-sm font-bold text-gray-700">Year:</span>
                        <span className="text-lg font-extrabold text-demargo-orange">{lightbox.award.year}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t-2 border-gray-200">
                      <p className="text-gray-700 text-base leading-relaxed font-medium">
                        {lightbox.award.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <img src={lightbox.award.logo} alt={lightbox.award.organization} className="w-16 h-16 object-contain" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Presented by</div>
                        <div className="text-lg font-bold text-gray-900">{lightbox.award.organization}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Testimonials" description="What our clients say about Demargo Interior Contractors - real testimonials from satisfied customers." />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-center">
        <span className="text-demargo-orange">What They</span> <span className="text-demargo-blue">Say</span>
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">Don't just take our word for it. Here's what our satisfied clients have to say about their Demargo experience.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: "Adom Bright",
            role: "Owner - Adom City Estates",
            rating: 5,
            quote: "Demargo transformed our living space beyond our expectations. The attention to detail and quality of work is exceptional. They delivered exactly what we envisioned and more."
          },
          {
            name: "Ayi Homes",
            role: "Developer - Ayi Mensah Park",
            rating: 5,
            quote: "Professional, timely, and absolutely stunning results. Our spaces now reflect the quality of our brand. Demargo's expertise in interior design is unmatched."
          },
          {
            name: "Sarah Mensah",
            role: "Business Owner - Holiday Inn Hotel",
            rating: 5,
            quote: "Working with Demargo was a game-changer for our office space. Their ability to understand our vision and bring it to life was extraordinary. Highly recommended!"
          },
          {
            name: "David Thompson",
            role: "Property Manager - Embassy Gardens",
            rating: 5,
            quote: "Demargo's team is incredibly talented. They not only delivered a stunning design but also made the entire process smooth and enjoyable. The quality of their work speaks for itself."
          },
          {
            name: "Grace Ofori",
            role: "Interior Designer - City Galleria",
            rating: 5,
            quote: "As a fellow designer, I can attest to Demargo's exceptional craftsmanship and attention to detail. Their work sets the standard for interior design in Ghana."
          },
          {
            name: "Michael Asante",
            role: "Hotel Manager - Holiday Inn Hotel",
            rating: 5,
            quote: "Demargo brought our hotel lobby to life with their innovative design approach. The transformation exceeded our expectations and has significantly improved our guest experience."
          },
          {
            name: "Efua Boateng",
            role: "Residential Client - Bel Rose Place",
            rating: 5,
            quote: "From start to finish, Demargo was a partner in our success. Their creative insights and seamless execution made a significant impact on our home renovation project."
          },
          {
            name: "John Dramani Mahama",
            role: "Corporate Client - Flagstaff House",
            rating: 5,
            quote: "Demargo is hands down the best interior design company we've ever worked with. Their team understands the intricacies of commercial interior design and delivers exceptional results."
          },
          {
            name: "Ama Serwaa",
            role: "Real Estate Developer - Nova by Devtraco Plus",
            rating: 5,
            quote: "Our experience with Demargo was nothing short of phenomenal. They approached our project with creativity, expertise, and a deep understanding of our industry needs."
          }
        ].map((testimonial, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, j) => (
                <svg key={j} className="w-5 h-5 text-demargo-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-gray-700 mb-4 italic">"{testimonial.quote}"</blockquote>
            <div className="border-t pt-4">
              <div className="font-semibold text-gray-900">{testimonial.name}</div>
              <div className="text-sm text-gray-600">{testimonial.role}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to Experience Excellence?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join our growing list of satisfied clients and transform your space with Demargo's premium interior design services.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="btn-primary">Get Started Today</Link>
          <Link to="/portfolio" className="btn-ghost">View Our Work</Link>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const address = 'Demargo Contractors, HM8Q+XJR, Gbawe'
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  const dirHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
  return (
    <section className="pb-0">
      <Seo title="Contact / Booking" description="Contact Demargo to schedule a consultation or request a quote." />

      {/* Backdrop image with centered map overlay (not edge-to-edge) */}
      <div className="w-full h-64 md:h-80 bg-center bg-cover" style={{ backgroundImage: 'url(/assets/Serene%20Master%20Retreat.jpg)' }} />
      <div className="-mt-12 md:-mt-16 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-black/10 bg-white">
            <iframe title="Demargo Location" src={mapSrc} className="w-full h-60 md:h-80" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>

      {/* Blue Contact banner */}
      <div className="relative -mt-10 md:-mt-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-xl md:rounded-2xl bg-[#0f4560] text-white px-6 md:px-12 py-10 md:py-16 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">Contact</h2>
            <p className="text-center text-white/90 mb-8">Send an email if you have questions about our services</p>
            <div className="flex justify-center">
              <a href="mailto:demargo1987@gmail.com" className="px-5 py-3 rounded-md border border-white/40 hover:bg-white hover:text-[#0f4560] transition">CONTACT US VIA FORM</a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact info tiles */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 bg-white rounded-b-2xl md:rounded-b-2xl">
          <div className="text-center px-6 py-10">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l7 7-7 7-7-7 7-7z" /></svg>
            </div>
            <div className="font-medium mb-1">Where are we?</div>
            <div className="text-sm text-gray-600">{address}</div>
            <div className="text-sm text-gray-600">Accra - Ghana</div>
            <a href={dirHref} target="_blank" rel="noreferrer" className="inline-block mt-3 text-demargo-blue underline">Directions</a>
          </div>
          <div className="text-center px-6 py-10 border-t md:border-t-0 md:border-l md:border-r">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92V21a2 2 0 01-2.18 2A19.86 19.86 0 013 5.18 2 2 0 015 3h4.09a2 2 0 012 1.72c.12.89.3 1.76.54 2.6a2 2 0 01-.45 2.11L9.91 10.09a16 16 0 006 6l.66-1.27a2 2 0 012.11-.45c.84.24 1.71.42 2.6.54A2 2 0 0122 16.92z" /></svg>
            </div>
            <div className="font-medium mb-1">Call us</div>
            <div className="mt-2 flex items-center justify-center gap-4 text-sm">
              <a href="tel:+233546478040" className="underline">Phone</a>
              <a href="https://wa.me/233546478040" target="_blank" rel="noreferrer" className="underline">WhatsApp</a>
            </div>
          </div>
          <div className="text-center px-6 py-10">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" /></svg>
            </div>
            <div className="font-medium mb-1">E-mail</div>
            <a href="mailto:demargo1987@gmail.com" className="text-sm text-gray-600 underline">info@demargointeriors.com</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Simple floating chat widget (single instance, toggles panel) */
// Chat widget removed per request

/* Helper component: auto-play video on scroll, muted */
function VideoReveal({ src, className }) {
  const vref = React.useRef(null)
  React.useEffect(() => {
    const v = vref.current
    if (!v) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          v.loop = true
          v.play().catch(() => { })
        }
        else v.pause()
      })
    }, { threshold: 0.3 })
    obs.observe(v)
    return () => obs.disconnect()
  }, [])
  return (
    <video ref={vref} muted playsInline preload="metadata" className={className || 'w-full h-auto'}>
      <source src={src} type="video/mp4" />
    </video>
  )
}

/* Floating Back-to-Top button */
function BackToTop() {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return (
    <button
      onClick={scrollTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-tr from-demargo-blue to-demargo-orange text-white shadow-xl w-12 h-12 flex items-center justify-center hover:opacity-95 active:scale-95 transition-all duration-300 ease-out transform ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3 pointer-events-none'}`}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
    </button>
  )
}

/* Simple on-site FAQ ChatBot (client-only, placeholder for API integration) */
function ChatBot() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([
    { role: 'bot', text: 'Hi! I\'m Demargo Assistant. Ask about services, pricing, booking, fabrics, or hours.' }
  ])
  const [input, setInput] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const [mode, setMode] = React.useState('default') // 'default' | 'booking-name' | 'booking-phone' | 'booking-service'
  const bookingRef = React.useRef({ name: '', phone: '', service: '' })
  const listRef = React.useRef(null)
  const navigate = useNavigate()

  const quickReplies = [
    { t: 'View Services', a: () => pushBotAction('Opening Services…', () => navigate('/services')) },
    { t: 'Interior Design', a: () => pushBotAction('Opening Interior Design…', () => navigate('/interior-design-services')) },
    { t: '3D Rendering', a: () => pushBotAction('Opening 3D Rendering…', () => navigate('/3d-rendering')) },
    { t: 'Contact', a: () => pushBotText('Phone: 0546478040 • Email: demargo1987@gmail.com') },
  ]

  const intents = [
    { q: /hour|open|close|time|working|when/i, a: () => 'We\'re open Mon–Fri 8AM–5PM, Sat 8AM–4PM.' },
    { q: /address|location|where/i, a: () => 'Address: Demargo Contractors, HM8Q+XJR, Gbawe. Service areas: Accra, Kumasi, Tema, Takoradi, Cape Coast and more.' },
    { q: /contact|phone|email|reach/i, a: () => 'Phone: 0546478040 • WhatsApp: wa.me/233546478040 • Email: demargo1987@gmail.com' },
    { q: /price|cost|how much|quote|estimate/i, a: () => 'Pricing varies by scope. Share your room size and preferred style, and we\'ll provide a tailored estimate. You can also book a free site visit.' },
    { q: /service|offer|do you|provide/i, a: () => 'We offer interior design, renovations, curtains & blinds, lighting, POP ceilings, smart home, painting, tiling, and cleaning. See /services for details.' },
    { q: /fabric|material|catalog|samples?/i, a: () => 'Browse our fabric display on the Fabrics page. We also bring samples to site during consultations.' },
    { q: /3d|render|visual/i, a: () => 'We create photorealistic 3D renders and walkthroughs so you can preview designs, materials, and lighting before build. See /3d-rendering.' },
    { q: /interior design|design my/i, a: () => 'Yes — full interior design: concept, space planning, lighting, curtains & blinds, styling, and installation. See /interior-design-services.' },
    { q: /book|booking|consult|site visit|appointment/i, a: () => startBooking() },
  ]

  function pushBotText(text) {
    setMessages(m => [...m, { role: 'bot', text }])
  }
  function pushBotAction(prefix, action) {
    setMessages(m => [...m, { role: 'bot', text: prefix }])
    setTimeout(() => action(), 200)
  }

  function startBooking() {
    setMode('booking-name')
    return 'Great! To book a free consultation, what\'s your full name?'
  }

  function handleBookingStep(text) {
    if (mode === 'booking-name') {
      bookingRef.current.name = text.trim()
      setMode('booking-phone')
      return 'Thanks! What\'s the best phone or WhatsApp number to reach you?'
    }
    if (mode === 'booking-phone') {
      bookingRef.current.phone = text.trim()
      setMode('booking-service')
      return 'Noted. Which service are you interested in? (e.g., Interior Design, 3D Rendering, Curtains & Blinds)'
    }
    if (mode === 'booking-service') {
      bookingRef.current.service = text.trim()
      setMode('default')
      const { name, phone, service } = bookingRef.current
      const wa = `https://wa.me/233546478040?text=${encodeURIComponent(`Hi, I am ${name}. My number is ${phone}. I\'d like to book: ${service}.`)}`
      const mail = `mailto:demargo1987@gmail.com?subject=${encodeURIComponent('Booking Request')}&body=${encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nService: ${service}`)}`
      return {
        type: 'actions',
        text: `Thanks ${name}! We\'ll contact you shortly. You can also message us now:`,
        buttons: [
          { label: 'WhatsApp', href: wa },
          { label: 'Email', href: mail }
        ]
      }
    }
    return null
  }

  const onSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const userMsg = { role: 'user', text: trimmed }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      let reply = null
      if (mode !== 'default') reply = handleBookingStep(trimmed)
      if (!reply) {
        const found = intents.find(f => f.q.test(trimmed))
        reply = found ? (typeof found.a === 'function' ? found.a() : found.a) : 'Thanks! A specialist will follow up. Meanwhile, explore our Services, Portfolio, or Fabrics.'
      }
      if (reply && typeof reply === 'object' && reply.type === 'actions') {
        setMessages(m => [...m, { role: 'bot', type: 'actions', text: reply.text, buttons: reply.buttons }])
      } else {
        setMessages(m => [...m, { role: 'bot', text: reply }])
      }
      setTyping(false)
    }, 550)
  }

  React.useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, typing, open])

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 max-w-[90vw] rounded-2xl bg-white shadow-2xl border overflow-hidden transition-all duration-300 ease-out transform origin-bottom-right">
          <div className="px-4 py-3 bg-gradient-to-r from-demargo-orange/90 to-demargo-blue/90 text-white flex items-center justify-between">
            <div className="font-semibold">Demargo Assistant</div>
            <button onClick={() => setOpen(false)} className="opacity-90 hover:opacity-100">×</button>
          </div>
          <div ref={listRef} className="max-h-80 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'bot' ? 'text-gray-800' : 'text-right'}>
                {m.type === 'actions' ? (
                  <div className="inline-block p-3 rounded-lg bg-slate-100">
                    <div className="text-sm mb-2 text-gray-800">{m.text}</div>
                    <div className="flex flex-wrap gap-2">
                      {(m.buttons || []).map((b, bi) => (
                        <a key={bi} href={b.href} target={b.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-demargo-blue text-white hover:opacity-90">{b.label}</a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'bot' ? 'bg-slate-100' : 'bg-demargo-blue text-white'}`}>{m.text}</span>
                )}
              </div>
            ))}
            {typing && (
              <div className="text-gray-800">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '120ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '240ms' }}></span>
                </span>
              </div>
            )}
          </div>
          <div className="p-3 border-t">
            <div className="flex flex-wrap gap-2 mb-2">
              {quickReplies.map((q, i) => (
                <button key={i} onClick={q.a} className="px-2 py-1 rounded-md text-xs border">{q.t}</button>
              ))}
              <button onClick={() => pushBotText(startBooking())} className="px-2 py-1 rounded-md text-xs border">Book a Visit</button>
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} placeholder={mode === 'booking-name' ? 'Your full name' : mode === 'booking-phone' ? 'Your phone or WhatsApp' : mode === 'booking-service' ? 'Service (e.g., Interior Design)' : 'Type your question...'} className="flex-1 px-3 py-2 rounded-md border outline-none" />
              <button onClick={onSend} className="px-4 py-2 rounded-md bg-demargo-orange text-white">Send</button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(v => !v)} className="rounded-full w-12 h-12 shadow-xl bg-gradient-to-tr from-demargo-orange to-demargo-blue text-white flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 00-9 9 9 9 0 009 9h6l3 3v-6a9 9 0 00-9-15z" /></svg>
      </button>
    </div>
  )
}

function InstagramHero() {
  const items = [
    { src: '/assets/dinin%20space1.jpg', alt: 'Dining Space' },
    { src: '/assets/kitchen.jpg', alt: 'Kitchen' },
    { src: '/assets/Lighting%20design.jpg', alt: 'Lighting Design' }
  ]
  const igUrl = 'https://instagram.com/demargo_blinds_curtains'
  return (
    <section aria-label="Instagram showcase" className="bg-black">
      <div className="grid md:grid-cols-3">
        {items.map((it, i) => (
          <a key={i} href={igUrl} target="_blank" rel="noreferrer" className="group relative block h-[55vh] md:h-[70vh] overflow-hidden">
            <img src={it.src} alt={it.alt} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition duration-500 ease-out" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <img src="/assets/ig%20white%20logo.png" alt="Instagram" className="w-16 h-16 object-contain" />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 text-gray-900 overflow-x-hidden">
        <Navbar />
        <AnimatedRoutes />
        <BackToTop />
        <ChatBot />
        <InstagramHero />
        <footer className="mt-0 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-extrabold text-demargo-orange">Demargo</div>
              <p className="mt-3 text-white/80">Transforming spaces with premium interior design services since 2018. Curtains, blinds, lighting and full-room makeovers.</p>
              <div className="mt-4 text-sm text-white/70 space-y-1">
                <div>Tel: 0546478040</div>
                <div>Email: demargo1987@gmail.com</div>
                <div>Mon–Fri 8AM–5PM, Sat 8AM–4PM</div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3">Services</div>
              <ul className="space-y-2 text-white/80 text-sm">
                {allServices.map((s, i) => (
                  <li key={`fs-${i}`}>{s.title}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Company</div>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/fabrics">Fabric Library</Link></li>
                <li><Link to="/clientele">Our Clientele</Link></li>
                <li><Link to="/testimonials">Testimonials</Link></li>
                <li><Link to="/awards">Awards</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Follow</div>
              <div className="flex gap-4 text-white/90 text-xl">
                <a href="https://www.facebook.com/share/1Jui7wFk7G/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H17l-.5 3h-2.3v7A10 10 0 0022 12z" /></svg>
                </a>
                <a href="https://instagram.com/demargo_blinds_curtains" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z" /></svg>
                </a>
                <a href="https://www.tiktok.com/@demargo_blinds?_t=ZM-90QcyZHzNTE&_r=1" target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 7a5 5 0 015-5h1c.2 2.1 1.6 3.9 3.6 4.6A7 7 0 0021 7v3a9 9 0 01-4.5-1.3v6.2A6.9 6.9 0 019.5 22 5.5 5.5 0 019 11.1V13a3.5 3.5 0 103.5 3.5V2H14a3 3 0 00-3 3v2H9z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/de-margo-interior-contractors-5a6153262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-.9 1.8-2.2 3.7-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.1c0-1.7 0-3.9-2.4-3.9-2.4 0-2.8 1.8-2.8 3.8V24h-4V8z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-white/70 flex justify-between">
              <span>© {new Date().getFullYear()} Demargo Interior Contractors</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const page = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 }
  }
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Home /></motion.div>} />
        <Route path="/portfolio" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Portfolio /></motion.div>} />
        <Route path="/services" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Services /></motion.div>} />
        <Route path="/interior-design-services" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><InteriorDesign /></motion.div>} />
        <Route path="/3d-rendering" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Rendering3D /></motion.div>} />
        <Route path="/fabrics" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Fabrics /></motion.div>} />
        <Route path="/clientele" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Clientele /></motion.div>} />
        <Route path="/testimonials" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Testimonials /></motion.div>} />
        <Route path="/awards" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Awards /></motion.div>} />
        <Route path="/about" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><About /></motion.div>} />
        <Route path="/contact" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Contact /></motion.div>} />
      </Routes>
    </AnimatePresence>
  )
}

function Portfolio() {
  const [lightbox, setLightbox] = React.useState({ open: false, src: '', kind: 'image' })
  const openLightbox = (src, kind) => setLightbox({ open: true, src, kind })
  const closeLightbox = () => setLightbox({ open: false, src: '', kind: 'image' })
  React.useEffect(() => {
    if (!lightbox.open) return
    const onKeyDown = (e) => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox.open])
  const items = [
    '/assets/video.mp4', '/assets/Contemporary%20living%20suite.jpg', '/assets/Living%20Space.mp4',
    '/assets/Serene%20Master%20Retreat.jpg', '/assets/v1.mp4', '/assets/Modern%20Dining%20Experience.jpg',
    '/assets/Office%20space.mp4', '/assets/bedroom.jpg', '/assets/Lighting%20design.jpg',
    '/assets/v3.mp4', '/assets/Executive%20Dining%20Experience.jpg', '/assets/kitchen.jpg',
    '/assets/Conference%20space.mp4', '/assets/livingspace.jpg', '/assets/v6.mp4',
    '/assets/Dinning%20and%20Solaret%20space.mp4', '/assets/custom%20curtains.jpg', '/assets/bedroom1.jpg',
    '/assets/v8.mp4', '/assets/dinning%20space%201%20.mp4', '/assets/Living%20Room%20Space.mp4',
    '/assets/3D%20Rendering.jpg', '/assets/v11.mp4', '/assets/Bedroom%20Space.mp4',
    '/assets/livingspace1.jpg', '/assets/v13.mp4', '/assets/Living%20Space%201.mp4',
    '/assets/kitchen1.jpg', '/assets/v16.mp4', '/assets/Living%20Space%20Room.mp4',
    '/assets/livingspace2.jpg', '/assets/v17.mp4', '/assets/Luxury%20Living%20space.jpg',
    '/assets/bedroom2.jpg', '/assets/diningspace.jpg', '/assets/livingspace3.jpg',
    '/assets/kitchen2.jpg', '/assets/dinin%20space1.jpg', '/assets/bedroom3.jpg',
    '/assets/livingspace4.jpg', '/assets/dining%20space2.jpg', '/assets/bedroom4.jpg',
    '/assets/conference%20room.jpg', '/assets/livingspace5.jpg', '/assets/bedroom5.jpg',
    '/assets/executive%20office.jpg', '/assets/livingspace6.jpg', '/assets/official%20space.jpg',
    '/assets/blinds.jpg', '/assets/wooden%20blinds.jpg', '/assets/zebra%20and%20roller%20blinds.jpg',
    '/assets/classy%20wardrobe.jpg'
  ]

  // Project descriptions mapping - Updated with renamed images and video captions
  const projectDescriptions = {
    '/assets/Contemporary%20living%20suite.jpg': {
      title: 'Contemporary Living Suite',
      description: 'Modern living space featuring sophisticated furniture arrangements and premium lighting design'
    },
    '/assets/Serene%20Master%20Retreat.jpg': {
      title: 'Serene Master Retreat',
      description: 'Elegant bedroom sanctuary with luxury bedding and custom window treatments'
    },
    '/assets/Executive%20Dining%20Experience.jpg': {
      title: 'Executive Living Space',
      description: 'Luxurious living room featuring premium furniture, elegant lighting, and sophisticated design elements'
    },
    '/assets/Lighting%20design.jpg': {
      title: 'Premium Lighting Design',
      description: 'Custom lighting solutions creating perfect ambiance and mood'
    },
    '/assets/custom%20curtains.jpg': {
      title: 'Custom Curtains Installation',
      description: 'Bespoke window treatments with premium fabric selection and flawless installation'
    },
    '/assets/video.mp4': {
      title: 'Project Showcase',
      description: 'Behind-the-scenes look at our interior design process and craftsmanship'
    },
    '/assets/v1.mp4': {
      title: 'Project Showcase',
      description: 'Contemporary living space with elegant furniture and ambient lighting'
    },
    '/assets/v2.mp4': {
      title: 'Project Showcase',
      description: 'Master bedroom featuring premium materials and sophisticated styling'
    },
    '/assets/v3.mp4': {
      title: 'Project Showcase',
      description: 'Professional workspace with modern furniture and smart lighting systems'
    },
    '/assets/v4.mp4': {
      title: 'Project Showcase',
      description: 'Elegant dining area with custom furniture and premium finishes'
    },
    '/assets/v5.mp4': {
      title: 'Project Showcase',
      description: 'Modern kitchen design with premium appliances and custom cabinetry'
    },
    '/assets/v6.mp4': {
      title: 'Project Showcase',
      description: 'Complete living space transformation with modern furniture and lighting'
    },
    '/assets/v7.mp4': {
      title: 'Project Showcase',
      description: 'Luxury bedroom design with custom bedding and window treatments'
    },
    '/assets/v8.mp4': {
      title: 'Project Showcase',
      description: 'Professional office space with modern furniture and smart home integration'
    },
    '/assets/v9.mp4': {
      title: 'Project Showcase',
      description: 'Sophisticated dining space with premium furniture and elegant lighting'
    },
    '/assets/v10.mp4': {
      title: 'Project Showcase',
      description: 'Modern kitchen with premium appliances and custom finishes'
    },
    '/assets/v11.mp4': {
      title: 'Project Showcase',
      description: 'Contemporary living area with elegant furniture and ambient lighting'
    },
    '/assets/v12.mp4': {
      title: 'Project Showcase',
      description: 'Luxury master bedroom with premium materials and custom styling'
    },
    '/assets/v13.mp4': {
      title: 'Project Showcase',
      description: 'Professional office space transformation with modern design elements'
    },
    '/assets/v14.mp4': {
      title: 'Project Showcase',
      description: 'Elegant dining space with sophisticated furniture and premium finishes'
    },
    '/assets/v15.mp4': {
      title: 'Project Showcase',
      description: 'Complete kitchen renovation with modern appliances and custom cabinetry'
    },
    '/assets/v16.mp4': {
      title: 'Project Showcase',
      description: 'Contemporary living space with premium furniture and lighting design'
    },
    '/assets/v17.mp4': {
      title: 'Project Showcase',
      description: 'Premium interior design project showcasing our expertise and craftsmanship'
    },
    // Updated with renamed images and better captions
    '/assets/bedroom.jpg': {
      title: 'Luxury Bedroom Design',
      description: 'Elegant bedroom sanctuary featuring premium materials, custom bedding, and sophisticated styling'
    },
    '/assets/bedroom1.jpg': {
      title: 'Master Bedroom Suite',
      description: 'Contemporary master bedroom with luxury finishes and custom window treatments'
    },
    '/assets/bedroom2.jpg': {
      title: 'Modern Bedroom Design',
      description: 'Sleek bedroom design with premium furniture and ambient lighting'
    },
    '/assets/bedroom3.jpg': {
      title: 'Elegant Bedroom Space',
      description: 'Sophisticated bedroom featuring custom furniture and premium materials'
    },
    '/assets/bedroom4.jpg': {
      title: 'Contemporary Bedroom',
      description: 'Modern bedroom design with elegant styling and premium finishes'
    },
    '/assets/bedroom5.jpg': {
      title: 'Luxury Bedroom Retreat',
      description: 'Premium bedroom sanctuary with custom design elements and sophisticated lighting'
    },
    '/assets/kitchen.jpg': {
      title: 'Modern Kitchen Design',
      description: 'Contemporary kitchen featuring premium appliances, custom cabinetry, and elegant finishes'
    },
    '/assets/kitchen1.jpg': {
      title: 'Luxury Kitchen Space',
      description: 'Sophisticated kitchen design with premium materials and modern appliances'
    },
    '/assets/kitchen2.jpg': {
      title: 'Executive Kitchen',
      description: 'High-end kitchen featuring custom cabinetry and premium finishes'
    },
    '/assets/livingspace.jpg': {
      title: 'Contemporary Living Space',
      description: 'Modern living area with elegant furniture and sophisticated lighting design'
    },
    '/assets/livingspace1.jpg': {
      title: 'Elegant Living Room',
      description: 'Sophisticated living space featuring premium furniture and custom styling'
    },
    '/assets/livingspace2.jpg': {
      title: 'Modern Living Area',
      description: 'Contemporary living room with luxury finishes and ambient lighting'
    },
    '/assets/livingspace3.jpg': {
      title: 'Premium Living Space',
      description: 'High-end living area featuring custom furniture and sophisticated design'
    },
    '/assets/livingspace4.jpg': {
      title: 'Luxury Living Room',
      description: 'Elegant living space with premium materials and modern styling'
    },
    '/assets/livingspace5.jpg': {
      title: 'Contemporary Living Design',
      description: 'Modern living space featuring sophisticated furniture and premium finishes'
    },
    '/assets/livingspace6.jpg': {
      title: 'Executive Living Space',
      description: 'High-end living area with custom design elements and luxury finishes'
    },
    '/assets/diningspace.jpg': {
      title: 'Elegant Dining Space',
      description: 'Sophisticated dining area with premium furniture and custom lighting'
    },
    '/assets/dinin%20space1.jpg': {
      title: 'Modern Dining Area',
      description: 'Contemporary dining space featuring elegant furniture and premium finishes'
    },
    '/assets/dining%20space2.jpg': {
      title: 'Luxury Dining Room',
      description: 'High-end dining space with sophisticated styling and custom elements'
    },
    '/assets/conference%20room.jpg': {
      title: 'Executive Conference Room',
      description: 'Professional conference space with modern furniture and smart technology integration'
    },
    '/assets/executive%20office.jpg': {
      title: 'Executive Office Design',
      description: 'Premium office space featuring custom furniture and sophisticated lighting'
    },
    '/assets/official%20space.jpg': {
      title: 'Official Meeting Space',
      description: 'Professional meeting room with modern design and premium finishes'
    },
    '/assets/blinds.jpg': {
      title: 'Custom Blinds Installation',
      description: 'Premium window treatments with elegant styling and perfect functionality'
    },
    '/assets/wooden%20blinds.jpg': {
      title: 'Wooden Blinds Design',
      description: 'Sophisticated wooden blinds installation with premium materials'
    },
    '/assets/zebra%20and%20roller%20blinds.jpg': {
      title: 'Zebra & Roller Blinds',
      description: 'Modern window treatments combining functionality with elegant design'
    },
    '/assets/classy%20wardrobe.jpg': {
      title: 'Classy Wardrobe Design',
      description: 'Luxury wardrobe featuring custom organization and premium materials'
    },
    '/assets/Office%20space.mp4': {
      title: 'Office Space',
      description: 'A professional and sophisticated office space designed for productivity and elegance'
    },
    '/assets/Conference%20space.mp4': {
      title: 'Conference Space',
      description: 'A modern conference space featuring premium furnishings and smart technology integration'
    },
    '/assets/Dinning%20and%20Solaret%20space.mp4': {
      title: 'Dining and Solaret Space',
      description: 'An elegant dining and solaret space showcasing sophisticated design and premium finishes'
    },
    '/assets/dinning%20space%201%20.mp4': {
      title: 'Dining Space',
      description: 'A beautiful dining space with modern furniture and elegant lighting design'
    },
    '/assets/Living%20Room%20Space.mp4': {
      title: 'Living Room Space',
      description: 'A beautiful living room space featuring elegant furniture and sophisticated design elements'
    },
    '/assets/Bedroom%20Space.mp4': {
      title: 'Bedroom Space',
      description: 'A top-notch bedroom showcasing luxury finishes and premium styling'
    },
    '/assets/Living%20Space.mp4': {
      title: 'Living Space',
      description: 'A stunning living room space featuring an automated curtain system that opens and closes with elegance'
    },
    '/assets/Living%20Space%201.mp4': {
      title: 'Living Space 1',
      description: 'A beautiful living room space showing great elegance and sophisticated design'
    },
    '/assets/Living%20Space%20Room.mp4': {
      title: 'Living Space Room',
      description: 'A stunning view of a living space featuring premium furniture and elegant design elements'
    },
    '/assets/3D%20Rendering.jpg': {
      title: '3D Rendering',
      description: 'High-quality 3D visualization showcasing photorealistic interior design concepts and material finishes'
    },
    '/assets/Modern%20Dining%20Experience.jpg': {
      title: 'Modern Dining Experience',
      description: 'Contemporary dining space featuring elegant furniture, sophisticated lighting, and premium finishes'
    },
    '/assets/Luxury%20Living%20space.jpg': {
      title: 'Luxury Living Space',
      description: 'Premium living area showcasing sophisticated design, elegant furniture, and luxury finishes'
    }
  }

  const inferKind = (src) => src.endsWith('.mp4') ? 'video' : 'image'
  const getAdjacentSrc = (current, dir) => {
    const idx = Math.max(0, items.findIndex(i => i === current))
    const next = (idx + dir + items.length) % items.length
    return items[next]
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Portfolio" description="Recent interior projects by Demargo." />
      <h1 className="text-3xl md:text-5xl font-extrabold text-center">
        <span className="text-demargo-orange">Demargo</span> <span className="text-demargo-blue">Project Showcase</span>
      </h1>
      <p className="text-center text-gray-600 mt-3 max-w-3xl mx-auto">A curated selection of interiors we’ve crafted — curtains, lighting systems and bespoke styling across living, dining and bedroom spaces.</p>

      {/* Portfolio grid - shuffled for variety */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          '/assets/video.mp4', '/assets/Contemporary%20living%20suite.jpg', '/assets/Living%20Space.mp4',
          '/assets/Serene%20Master%20Retreat.jpg', '/assets/v1.mp4', '/assets/Modern%20Dining%20Experience.jpg',
          '/assets/Office%20space.mp4', '/assets/bedroom.jpg', '/assets/Lighting%20design.jpg',
          '/assets/v3.mp4', '/assets/Executive%20Dining%20Experience.jpg', '/assets/kitchen.jpg',
          '/assets/Conference%20space.mp4', '/assets/livingspace.jpg', '/assets/v6.mp4',
          '/assets/Dinning%20and%20Solaret%20space.mp4', '/assets/custom%20curtains.jpg', '/assets/bedroom1.jpg',
          '/assets/v8.mp4', '/assets/dinning%20space%201%20.mp4', '/assets/Living%20Room%20Space.mp4',
          '/assets/3D%20Rendering.jpg', '/assets/v11.mp4', '/assets/Bedroom%20Space.mp4',
          '/assets/livingspace1.jpg', '/assets/v13.mp4', '/assets/Living%20Space%201.mp4',
          '/assets/kitchen1.jpg', '/assets/v16.mp4', '/assets/Living%20Space%20Room.mp4',
          '/assets/livingspace2.jpg', '/assets/v17.mp4', '/assets/Luxury%20Living%20space.jpg',
          '/assets/bedroom2.jpg', '/assets/diningspace.jpg', '/assets/livingspace3.jpg',
          '/assets/kitchen2.jpg', '/assets/dinin%20space1.jpg', '/assets/bedroom3.jpg',
          '/assets/livingspace4.jpg', '/assets/dining%20space2.jpg', '/assets/bedroom4.jpg',
          '/assets/conference%20room.jpg', '/assets/livingspace5.jpg', '/assets/bedroom5.jpg',
          '/assets/executive%20office.jpg', '/assets/livingspace6.jpg', '/assets/official%20space.jpg',
          '/assets/blinds.jpg', '/assets/wooden%20blinds.jpg', '/assets/zebra%20and%20roller%20blinds.jpg',
          '/assets/classy%20wardrobe.jpg'
        ].map((src, i) => {
          const project = projectDescriptions[src] || {
            title: `Project ${i + 1}`,
            description: 'Premium interior design project showcasing our expertise and craftsmanship'
          }
          return (
            <article key={`itm-${i}`} className="group relative rounded-2xl overflow-hidden bg-white card-glow card-hover">
              <button className="relative w-full text-left" onClick={() => openLightbox(src, src.endsWith('.mp4') ? 'video' : 'image')}>
                {src.endsWith('.mp4') ? (
                  <video src={src} muted playsInline loop autoPlay className="w-full h-64 object-cover" />
                ) : (
                  <img src={src} alt={`Portfolio ${i + 1}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                {/* Hover overlay with project description */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-white/90 leading-relaxed">{project.description}</p>
                  </div>
                </div>
              </button>
            </article>
          )
        })}
      </div>

      {/* Hero-style video showcase */}
      <section className="mt-12">
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[50vh] md:h-[75vh] overflow-hidden">
          <VideoReveal src="/assets/video.mp4" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        {/* Removed typing heading per request */}
        <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['/assets/v1.mp4', '/assets/v3.mp4', '/assets/v6.mp4'].map((src, i) => {
            const project = projectDescriptions[src] || {
              title: `Project Video ${i + 1}`,
              description: 'Premium interior design project showcasing our expertise and craftsmanship'
            }
            return (
              <article key={`vmore-${i}`} className="group relative rounded-2xl overflow-hidden bg-white card-glow">
                <button className="relative w-full" onClick={() => openLightbox(src, 'video')}>
                  <video src={src} muted playsInline loop autoPlay className="w-full h-64 object-cover" />
                  {/* Hover overlay with project description */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-white/90 leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {lightbox.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full overflow-hidden rounded-lg bg-black">
              {lightbox.kind === 'video' ? (
                <video src={lightbox.src || '/assets/video.mp4'} controls autoPlay muted className="w-full h-[70vh] object-contain bg-black" />
              ) : (
                <img src={lightbox.src} alt="preview" className="w-full h-[70vh] object-contain bg-black" />
              )}
            </div>
            <div className="mt-3 flex justify-between">
              <button onClick={() => setLightbox(p => ({ ...p, src: getAdjacentSrc(p.src, -1), kind: inferKind(getAdjacentSrc(p.src, -1)) }))} className="inline-flex px-4 py-2 rounded bg-white/90 text-gray-800">Prev</button>
              <button onClick={closeLightbox} className="inline-flex px-4 py-2 rounded bg-white text-gray-800">Close</button>
              <button onClick={() => setLightbox(p => ({ ...p, src: getAdjacentSrc(p.src, 1), kind: inferKind(getAdjacentSrc(p.src, 1)) }))} className="inline-flex px-4 py-2 rounded bg-white/90 text-gray-800">Next</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { Helmet } from 'react-helmet'
import ProjectTracker from './pages/ProjectTracker'
import AdminPanel from './pages/AdminPanel'
import FabricCollection from './pages/FabricCollection'

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
      <meta name="keywords" content="interior design company, interior design services, professional interior designers, residential interior design, commercial interior design, interior decorating services, modern interior design, luxury interior design, affordable interior design, custom interior design, interior design consultation, full service interior design, interior design solutions, creative interior design, interior design experts, interior design firm, home interior design, office interior design, interior design ideas, interior design planning, interior design concepts, interior design studio, interior design specialists, interior design professionals, interior design contractors, interior styling services, interior design makeover, interior renovation design, interior design project management, bespoke interior design, home interior designers, living room interior design, bedroom interior design, kitchen interior design, bathroom interior design, apartment interior design, house interior design, small space interior design, modern home interiors, luxury home interior design, minimalist interior design, classic interior design, contemporary home interiors, family house interior design, interior design for homes, interior design for apartments, interior decor ideas, interior renovation for homes, custom home interiors, home makeover services, interior styling for homes, interior design for new homes, smart home interior design, elegant home interiors, cozy interior design ideas, interior design for villas, interior design for duplex, interior design for townhouses, interior design for rentals, interior design for Airbnb, home interior consultants, interior design layout planning, interior design furniture selection, home lighting design, interior color consultation, interior design for kitchens and baths, interior finishing services, modern house interiors, stylish home interiors, functional interior design, corporate interior design, commercial interior designers, office space planning, office renovation design, modern office interiors, workspace interior design, office fit-out services, interior design for offices, office furniture layout, office branding interiors, interior design for companies, interior design for startups, interior design for coworking spaces, interior design for banks, interior design for hotels, hospitality interior design, restaurant interior design, cafe interior design, bar interior design, retail interior design, shop interior design, showroom interior design, mall interior design, salon interior design, spa interior design, clinic interior design, hospital interior design, school interior design, classroom interior design, church interior design, auditorium interior design, conference room interior design, office lighting design, ergonomic office design, commercial space interior design, warehouse interior design, gym interior design, fitness center interior design, professional office interiors, modern interior design style, contemporary interior design style, minimalist interior design style, luxury interior design style, classic interior design style, industrial interior design, Scandinavian interior design, bohemian interior design, rustic interior design, traditional interior design, elegant interior design style, simple interior design, creative interior design ideas, functional interior design style, timeless interior design, chic interior design, eco-friendly interior design, sustainable interior design, smart interior design, high-end interior design, stylish interior design, interior design trends, modern decor ideas, interior design inspiration, interior styling trends, interior decor styles, space-saving interior design, luxury decor ideas, minimalist decor ideas, premium interior design, interior designers near me, interior design company near me, best interior designers, top interior design company, affordable interior designers, professional interior designers near me, interior design services near me, interior design consultation near me, interior decorators near me, residential interior designers near me, commercial interior designers near me, office interior designers near me, interior design experts near me, interior design firm near me, trusted interior designers, reliable interior design company, interior design services for homes, interior design services for offices, custom interior design services, interior design and renovation services, full interior design services, interior design project services, interior design planning services, interior finishing contractors, interior renovation experts, interior decoration services, interior design consultation services, interior design company for homes, interior design company for offices, interior design and build services, interior design cost, interior design pricing, affordable interior design services, luxury interior design services, interior design packages, interior design quotation, hire an interior designer, best interior design services, interior design company for renovations, interior design company for new buildings, interior design for small apartments, interior design for luxury homes, interior design for modern offices, interior design consultation cost, interior design company reviews, interior design company portfolio, interior design project cost, interior design services pricing, interior design company contact, interior design company website, interior design booking, interior design project timeline, interior design for budget homes, interior design for commercial buildings, interior design for office renovation, interior design for retail stores, interior design for restaurants and cafes, interior design company near me for homes, interior design company near me for offices, interior design experts for hire" />

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
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const scrollableEl = document.querySelector('.min-h-screen.overflow-x-hidden') || document.querySelector('main') || document.scrollingElement || document.documentElement || document.body
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    const onScroll = () => {
      const top = scrollableEl?.scrollTop || window.scrollY || window.pageYOffset || 0
      setScrolled(top > 12)
    }
    onScroll()

    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    scrollableEl?.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      scrollableEl?.removeEventListener('scroll', onScroll)
    }
  }, [])
  const linkClass = ({ isActive }) =>
    `px-2 py-1 rounded transition-colors ${isActive ? 'text-demargo-orange' : 'hover:text-demargo-orange'}`
  return (
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur shadow' : 'bg-transparent'}`}>
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
          <li><NavLink to="/fabric-collection" className={linkClass}>Fabric Collection</NavLink></li>
          <li><NavLink to="/clientele" className={linkClass}>Clientele</NavLink></li>
          <li><NavLink to="/testimonials" className={linkClass}>Testimonials</NavLink></li>
          <li><NavLink to="/awards" className={linkClass}>Awards</NavLink></li>
          <li><NavLink to="/track" className={linkClass}>Track Project</NavLink></li>
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
              <li><NavLink onClick={() => setOpen(false)} to="/fabric-collection" className={linkClass}>Fabric Collection</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/clientele" className={linkClass}>Clientele</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/testimonials" className={linkClass}>Testimonials</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/awards" className={linkClass}>Awards</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/about" className={linkClass}>About</NavLink></li>
              <li><NavLink onClick={() => setOpen(false)} to="/track" className={linkClass}>Track Project</NavLink></li>
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
        <video
          src="/assets/newweek.mp4"
          muted
          playsInline
          loop
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
          ref={el => {
            videoRef.current = el
            revealRefs.current[10] = el
          }}
          style={{ transform: 'translateY(0px) scale(1.05)' }}
          data-parallax
        />
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
              <div className="text-3xl font-extrabold">4000+</div>
              <div className="text-white/80">Projects</div>
            </div>
            <div className="panel-glass p-6 text-white">
              <div className="text-3xl font-extrabold">8+</div>
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

      {/* AWARD HERO - Classy spotlight section (moved below main hero) */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-[76vh] md:h-[88vh] flex items-center overflow-hidden"
      >
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
      </motion.section>

      {/* ABOUT SNAPSHOT SECTION (second screenshot) */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 py-16"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-demargo-orange font-semibold tracking-wide">ABOUT DEMARGO</div>
            <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">Crafting Dreams Into <span className="text-demargo-blue">Reality</span></h2>
            <p className="mt-4 text-gray-700">Since 2018, we've been transforming spaces with premium interior design solutions. Our expertise in curtains, lighting, and bedroom styling has made us the preferred choice for discerning clients across the region.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-orange-50">
                <div className="text-3xl font-extrabold text-demargo-orange">4000+</div>
                <div className="text-gray-700">Projects Completed</div>
              </div>
              <div className="p-6 rounded-2xl bg-blue-50">
                <div className="text-3xl font-extrabold text-demargo-blue">8+</div>
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
      </motion.section>

      {/* SERVICES PREVIEW (third screenshot tone) */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 py-16"
      >
        <div className="text-demargo-orange font-semibold text-center">OUR SERVICES</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mt-2">Comprehensive Interior Solutions</h2>
        <p className="text-center text-gray-600 mt-3 max-w-3xl mx-auto">From custom curtains to sophisticated lighting, we offer complete interior design services that transform your space into a masterpiece of luxury and functionality.</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8 card-perspective-container">
          {[
            { title: 'Living Room Setting', img: '/assets/hero%20pic.jpg' },
            { title: 'Lighting System', img: '/assets/Lighting%20design.jpg' },
            { title: 'Bedroom Styling', img: '/assets/custom%20curtains.jpg' },
            { title: '3D Rendering', img: '/assets/3D%20Rendering.jpg' }
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              style={{ transformOrigin: 'bottom center' }}
              className="perspective-card"
            >
              <Link to="/portfolio" className="rounded-2xl overflow-hidden bg-white border card-glow block h-full">
                <img src={s.img} alt={s.title} className="w-full h-64 object-cover transition-transform duration-700 hover:scale-105" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

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
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 py-16"
      >
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
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="panel-glass p-2 card-glow order-1 md:order-none cursor-pointer"
              >
                <div className="aspect-[16/11] rounded-2xl overflow-hidden bg-slate-200 relative">
                  <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute left-4 top-4 px-4 py-2 rounded-full bg-demargo-orange text-white font-semibold">2024</div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="order-2 md:order-none"
              >
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
              </motion.div>
            </div>
          ))}
        </div>
      </motion.section>

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
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-slate-900 text-white"
      >
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-center text-4xl md:text-5xl font-extrabold">What Our Clients Say</h2>
          <p className="text-center text-white/80 mt-3 max-w-3xl mx-auto">Don't just take our word for it. Here's what our satisfied clients have to say about their Demargo experience.</p>
          <div className="mt-10 grid md:grid-cols-2 gap-6 card-perspective-container">
            {[{ n: 'Adom Bright', r: 'Homeowner', q: 'Demargo transformed our living space beyond our expectations. The attention to detail and quality of work is exceptional.' }, { n: 'Ayi Homes', r: 'Developer', q: 'Professional, timely, and absolutely stunning results. Our spaces now reflect the quality of our brand.' }].map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
                style={{ transformOrigin: 'bottom center' }}
                className="panel-glass p-6 text-white perspective-card"
              >
                <div className="text-demargo-orange mb-2">★★★★★</div>
                <blockquote className="text-white/90">“{t.q}”</blockquote>
                <figcaption className="mt-4 text-sm text-white/80">{t.n}<span className="mx-1">•</span>{t.r}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 pb-16"
      >
        <div className="cta-card">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">Ready to Transform Your Space?</h3>
            <p className="text-gray-600 mt-1">Book a free site visit and consultation today.</p>
          </div>
          <Link to="/contact" className="btn-primary">Get Started</Link>
        </div>
      </motion.section>
    </main>
  )
}

function Services() {
  // uses shared allServices defined above

  return (
    <>
      <Seo title="Services" description="Detailed list of Demargo services including curtains, renovations, woodwork and smart home systems." />

      {/* Large Video Hero Section */}
      <section className="relative h-[60vh] md:h-[75vh] flex items-center overflow-hidden bg-slate-900 w-full">
        <video
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/reel.MOV" type="video/quicktime" />
          <source src="/assets/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          <div className="text-white max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Our <span className="text-demargo-orange">Services</span>
            </h1>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link to="/contact" className="btn-primary">Book a Consultation</Link>
              <Link to="/portfolio" className="btn-ghost text-white border-white hover:bg-white hover:text-slate-900">View Portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        {/* Intro and first row */}
        <div className="mt-10 grid md:grid-cols-3 gap-6 items-start card-perspective-container">
          <motion.article
            initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom center' }}
            className="bg-white rounded-2xl p-6 shadow-sm perspective-card"
          >
            <div className="text-sm text-gray-500">Demargo Services</div>
            <h2 className="text-2xl font-semibold mt-2">Our Services</h2>
            <p className="text-gray-700 mt-3">We provide expert interior design and renovation services across Ghana. From homes to offices, we create beautiful, functional spaces with style and precision — serving Accra, Kumasi, Tema, Takoradi, Cape Coast, and beyond.</p>
          </motion.article>
          {allServices.slice(0, 2).map((s, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i + 1) * 0.15 }}
              style={{ transformOrigin: 'bottom center' }}
              className="bg-white rounded-2xl p-6 shadow-sm perspective-card"
            >
              <div className="text-demargo-blue mb-2">{s.icon}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
            </motion.article>
          ))}
        </div>

        {/* Remaining grid */}
        <div className="mt-6 grid md:grid-cols-3 gap-6 card-perspective-container">
          {allServices.slice(2, 8).map((s, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.15 }}
              style={{ transformOrigin: 'bottom center' }}
              className="bg-white rounded-2xl p-6 shadow-sm perspective-card"
            >
              <div className="text-demargo-blue mb-2">{s.icon}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
            </motion.article>
          ))}
        </div>

        {/* Cleaning full width (anchors feature video below) */}
        <div className="mt-6">
          {allServices.slice(8, 9).map((s, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'bottom center' }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="text-demargo-blue mb-2">{s.icon}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

  {/* Hero video highlight - full width */ }
  <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-10 overflow-hidden">
    <VideoReveal src="/assets/v19.mp4" className="w-full h-[60vh] md:h-[75vh] object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div className="absolute inset-0 flex items-end md:items-center">
      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
        <div className="px-6 py-8 md:py-12 md:px-10 text-white max-w-2xl space-y-3">
          <div className="badge-glass">Feature Project</div>
          <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">Double-height curtain showcase</h3>
          <p className="text-white/85 text-lg">Tailored charcoal panels and sheer layering framing a statement chandelier — a glimpse of our craftsmanship in motion.</p>
        </div>
      </div>
    </div>
  </section>
    </>
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
          <img src="/assets/3D interior rendering.jpeg" alt="3D interior rendering" className="w-full h-72 object-cover" />
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 card-perspective-container">
          {governmentProjects.map((c, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.1 }}
              style={{ transformOrigin: 'bottom center' }}
              className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100 hover:-translate-y-0.5 perspective-card"
            >
              <img src={c.img} alt={c.name} className="w-full aspect-[4/3] object-cover" />
              <figcaption className="px-4 py-3 text-sm text-gray-800 font-medium text-center bg-slate-50 border-t">{c.name}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Residential Projects */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          <span className="text-demargo-orange">Residential</span> <span className="text-demargo-blue">Projects</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 card-perspective-container">
          {residentialProjects.map((c, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.1 }}
              style={{ transformOrigin: 'bottom center' }}
              className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100 hover:-translate-y-0.5 perspective-card"
            >
              <img src={c.img} alt={c.name} className="w-full aspect-[4/3] object-cover" />
              <figcaption className="px-4 py-3 text-sm text-gray-800 font-medium text-center bg-slate-50 border-t">{c.name}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Commercial Projects */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          <span className="text-demargo-orange">Commercial</span> <span className="text-demargo-blue">Projects</span>
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 card-perspective-container">
          {commercialProjects.map((c, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.1 }}
              style={{ transformOrigin: 'bottom center' }}
              className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100 hover:-translate-y-0.5 perspective-card"
            >
              <img src={c.img} alt={c.name} className="w-full aspect-[4/3] object-cover" />
              <figcaption className="px-4 py-3 text-sm text-gray-800 font-medium text-center bg-slate-50 border-t">{c.name}</figcaption>
            </motion.figure>
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 card-perspective-container">
          {[
            { name: 'Mr Jeffery Ofosuhene Apenteng', role: 'Chief Executive Officer', img: '/assets/Mr%20Jeffery%20Ofosu-Hene%20Appenteng.jpg' },
            { name: 'Mrs Barbara Apenteng', role: 'Chief Operating Officer', img: '/assets/Mrs%20Babara%20Ofusu-Hene%20Appenteng.jpg' },
            { name: 'George Nettey', role: 'Head of Media', img: '/assets/George.jpg' },
            { name: 'Micheal Martey', role: 'Head of Installation', img: '/assets/MDK.jpg' },
            { name: 'Samuel Nettey', role: 'Head of Measurements', img: '/assets/Omar.jpg' }
          ].map((m, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.1 }}
              style={{ transformOrigin: 'bottom center' }}
              className="rounded-xl overflow-hidden bg-white text-center shadow-sm perspective-card"
            >
              <img
                src={m.img}
                alt={m.name}
                className={`w-full h-60 md:h-52 bg-slate-100 ${i === 0 ? 'object-contain md:object-cover' :
                  i === 4 ? 'object-contain' :
                    'object-cover'
                  }`}
                style={
                  i === 0 || i === 4 ? {} :
                    i === 1 ? { objectPosition: 'center 20%' } : // Mrs Babara
                      i === 2 ? { objectPosition: 'center 30%' } : // George
                        { objectPosition: 'center 25%' } // Micheal
                }
              />
              <figcaption className="px-3 py-2">
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-gray-600">{m.role}</div>
              </figcaption>
            </motion.figure>
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
            <div className="text-3xl font-extrabold text-demargo-orange mb-2">8+</div>
            <div className="text-gray-700">Years of Excellence</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-demargo-blue mb-2">4000+</div>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 card-perspective-container">
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
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.1 }}
            style={{ transformOrigin: 'bottom center' }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow perspective-card"
          >
            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, j) => (
                <svg key={j} className="w-5 h-5 text-demargo-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-gray-700 mb-4">"{testimonial.quote}"</blockquote>
            <div className="border-t pt-4">
              <div className="font-semibold text-gray-900">{testimonial.name}</div>
              <div className="text-sm text-gray-600">{testimonial.role}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to Experience Excellence?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join our growing list of satisfied clients and transform your space with Demargo's premium interior design services.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="btn-primary">Get Started Today</Link>
          <Link to="/portfolio" className="btn-ghost-light">View Our Work</Link>
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
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">Book a Consultation</h2>
            <p className="text-center text-white/90 mb-8 max-w-2xl mx-auto">Schedule a consultation directly via Calendly to get started.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="https://calendly.com/gideonogunu/demargo-booking-consultation" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-md bg-demargo-orange font-semibold hover:bg-white text-white hover:text-[#e46424] transition group relative overflow-hidden flex items-center shadow-lg hover:-translate-y-0.5">
                <span className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition"></span>
                <span className="relative">BOOK</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact info tiles */}
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-b-2xl md:rounded-b-2xl">
          <div className="text-center px-6 py-10">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l7 7-7 7-7-7 7-7z" /></svg>
            </div>
            <div className="font-medium mb-1">Where are we?</div>
            <div className="text-sm text-gray-600">{address}</div>
            <div className="text-sm text-gray-600">Accra - Ghana</div>
            <a href={dirHref} target="_blank" rel="noreferrer" className="inline-block mt-3 text-demargo-blue underline">Directions</a>
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
      className={`fixed bottom-6 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 chatbot-icon border-2 border-demargo-orange text-demargo-orange bg-transparent shadow-lg w-12 h-12 flex items-center justify-center hover:text-demargo-blue hover:border-demargo-blue hover:bg-slate-100/30 backdrop-blur-xs active:scale-95 transition-all duration-300 ease-out transform ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3 pointer-events-none'}`}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
    </button>
  )
}

/* AI-powered chat widget backed by a secure serverless proxy */
function ChatBot() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([
    { role: 'bot', text: 'Hi! I\'m Demargo Assistant. Ask me anything — about our services, design ideas, renovations, or any other question you have.' }
  ])
  const [input, setInput] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const [mode, setMode] = React.useState('default') // 'default' | 'booking-name' | 'booking-phone' | 'booking-service'
  const [error, setError] = React.useState('')
  const bookingRef = React.useRef({ name: '', phone: '', service: '' })
  const listRef = React.useRef(null)

  React.useEffect(() => {
    const handleClose = () => setOpen(false)
    window.addEventListener('closeAllDialogs', handleClose)
    return () => window.removeEventListener('closeAllDialogs', handleClose)
  }, [])

  const navigate = useNavigate()

  const quickReplies = [
    { t: 'View Services', a: () => pushBotAction('Opening Services…', () => navigate('/services')) },
    { t: 'Fabric Collection', a: () => pushBotAction('Opening Fabric Collection…', () => navigate('/fabric-collection')) },
    { t: 'Track Project', a: () => pushBotAction('Opening Project Tracker…', () => navigate('/track')) },
    { t: '3D Rendering', a: () => pushBotAction('Opening 3D Rendering…', () => navigate('/3d-rendering')) },
    { t: 'Contact', a: () => pushBotText('Phone: 0546478040 • Email: demargo1987@gmail.com') },
  ]

  const renderMessageText = (text) => {
    if (typeof text !== 'string') return text
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      const [_, label, url] = match
      const matchIndex = match.index

      if (matchIndex > lastIndex) {
        parts.push(text.slice(lastIndex, matchIndex))
      }

      const isRelative = url.startsWith('/')
      if (isRelative) {
        parts.push(
          <button
            key={matchIndex}
            onClick={() => {
              setOpen(false)
              navigate(url)
            }}
            className="text-demargo-orange hover:underline font-semibold inline-flex items-center gap-0.5 mx-0.5 align-baseline"
          >
            {label}
          </button>
        )
      } else {
        parts.push(
          <a
            key={matchIndex}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-demargo-orange hover:underline font-semibold inline-flex items-center gap-0.5 mx-0.5 align-baseline"
          >
            {label}
          </a>
        )
      }

      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

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

  async function getAssistantReply(message, history) {
    const contactFallback = 'Please call 0546478040 or email demargo1987@gmail.com for help.'

    let response
    try {
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: history.slice(-8)
        })
      })
    } catch (err) {
      setError(err.message || 'Network error')
      return `I couldn't reach the assistant. ${contactFallback}`
    }

    const text = await response.text()
    if (!text) {
      setError(`Empty response from assistant (HTTP ${response.status})`)
      return `I couldn't get a response from the assistant (HTTP ${response.status}). ${contactFallback}`
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      setError('Assistant returned invalid JSON')
      return `The assistant returned an unexpected response. ${contactFallback}`
    }

    if (data.reply) {
      setError('')
      return data.reply
    }

    const apiError = data?.error || `HTTP ${response.status}`
    setError(String(apiError))
    return `The assistant could not respond: ${apiError}. ${contactFallback}`
  }

  const onSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg = { role: 'user', text: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setTyping(true)
    setError('')

    try {
      let reply = null
      if (mode !== 'default') {
        reply = handleBookingStep(trimmed)
      } else {
        reply = await getAssistantReply(trimmed, messages)
      }

      if (reply && typeof reply === 'object' && reply.type === 'actions') {
        setMessages(m => [...m, { role: 'bot', type: 'actions', text: reply.text, buttons: reply.buttons }])
      } else {
        setMessages(m => [...m, { role: 'bot', text: reply }])
      }
    } catch (err) {
      setMessages(m => [...m, { role: 'bot', text: 'I’m having trouble reaching the assistant right now. Please call 0546478040 or email demargo1987@gmail.com for immediate help.' }])
      setError(err.message || 'Unable to get a response right now.')
    } finally {
      setTyping(false)
    }
  }

  React.useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, typing, open])

  return (
    <div className="fixed z-50 right-4 sm:right-6 bottom-4 sm:bottom-20 left-4 sm:left-auto pointer-events-none flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[min(92vw,360px)] rounded-2xl bg-white shadow-2xl border overflow-hidden transition-all duration-300 ease-out transform origin-bottom-right pointer-events-auto">
          <div className="px-4 py-3 bg-gradient-to-r from-demargo-orange/90 to-demargo-blue/90 text-white flex items-center justify-between">
            <div className="font-semibold">Demargo Assistant</div>
            <button onClick={() => setOpen(false)} className="opacity-90 hover:opacity-100">×</button>
          </div>
          <div ref={listRef} className="max-h-[70vh] overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'bot' ? 'text-gray-800' : 'text-right'}>
                {m.type === 'actions' ? (
                  <div className="inline-block p-3 rounded-lg bg-slate-100">
                    <div className="text-sm mb-2 text-gray-800">{renderMessageText(m.text)}</div>
                    <div className="flex flex-wrap gap-2">
                      {(m.buttons || []).map((b, bi) => (
                        <a key={bi} href={b.href} target={b.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-demargo-blue text-white hover:opacity-90">{b.label}</a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'bot' ? 'bg-slate-100' : 'bg-demargo-blue text-white'}`}>{renderMessageText(m.text)}</span>
                )}
              </div>
            ))}
            {typing && (
              <div className="text-gray-800">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">
                  <span className="w-2 h-2 chatbot-icon bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 chatbot-icon bg-gray-500 animate-bounce" style={{ animationDelay: '120ms' }}></span>
                  <span className="w-2 h-2 chatbot-icon bg-gray-500 animate-bounce" style={{ animationDelay: '240ms' }}></span>
                </span>
              </div>
            )}
            {error && <div className="text-xs text-red-600">{error}</div>}
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
      <div className="relative pointer-events-auto flex flex-col items-end">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="mb-3 bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 shadow-lg flex items-center gap-2 whitespace-nowrap chatbot-talk-bubble border border-slate-100 hover:border-slate-200 transition-all cursor-pointer pointer-events-auto select-none animate-bounce-slow"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 chatbot-icon"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 chatbot-icon"></span>
            </span>
            <span>Talk to me</span>
            <div className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 bg-white border-r border-b border-slate-100 rotate-45"></div>
          </button>
        )}
        <button
          onClick={() => setOpen(v => !v)}
          className="chatbot-3d-button w-14 h-14 relative block"
          aria-label="Toggle Chat"
        >
          <img
            src="/assets/Demargo%20Logo.jpg"
            alt="Demargo Chatbot"
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute inset-0 rounded-full chatbot-icon bg-gradient-to-tr from-transparent via-white/5 to-white/30 pointer-events-none" />
        </button>
      </div>
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

function SplashScreen({ onComplete }) {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 15 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="flex flex-col justify-center items-center w-full"
        onAnimationComplete={() => {
          // Additional exit wait can be done via App's timer, but this ensures it plays
        }}
      >
        <img
          src="/assets/Demargo%20Logo.jpg"
          alt="Demargo Logo"
          className="w-40 md:w-56 mb-12 md:mb-16 object-contain mix-blend-screen bg-transparent"
        />
        <h1
          className="font-extrabold text-white leading-none tracking-tight flex items-center justify-center whitespace-nowrap"
          style={{
            fontSize: 'min(11vw, 140px)',
            transform: 'scaleY(2.8)',
            fontFamily: '"Impact", "Bebas Neue", "Oswald", sans-serif'
          }}
        >
          BE <span className="text-demargo-orange ml-[2vw]">DIFFERENT</span>
        </h1>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  useEffect(() => {
    // Hide splash after a short delay to allow the intro to play out
    const timer = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      <div className="min-h-screen bg-slate-50 text-gray-900 overflow-x-hidden pt-16">
        <Navbar />
        <AnimatedRoutes />
        <BackToTop />
        <ChatBot />
        <InstagramHero />
        <footer className="bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-demargo-orange">Demargo</h3>
              <p className="text-sm text-white/80">Transforming spaces with premium interior design services since 2018.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Services</h4>
              <ul className="space-y-2 text-sm text-white/80">
                {allServices.slice(0, 5).map((s, i) => <li key={i}>{s.title}</li>)}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Connect</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/track">Track Project</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Contact Info</h4>
              <div className="text-sm text-white/80 space-y-2">
                <p>Tel: 0546478040</p>
                <p>Email: demargo1987@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-white/70">
            © {new Date().getFullYear()} Demargo Interior Contractors. All rights reserved.
            <div className="mt-2">
              Made by <a href="http://myportfolioworks.vercel.app/" target="_blank" rel="noreferrer" className="text-white font-semibold underline">GOLDENBOY DESIGNS</a>
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
        <Route path="/fabric-collection" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><FabricCollection /></motion.div>} />
        <Route path="/clientele" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Clientele /></motion.div>} />
        <Route path="/testimonials" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Testimonials /></motion.div>} />
        <Route path="/awards" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><Awards /></motion.div>} />
        <Route path="/about" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><About /></motion.div>} />
        <Route path="/track" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><ProjectTracker /></motion.div>} />
        <Route path="/admin" element={<motion.div {...page} transition={{ duration: .35, ease: 'easeOut' }}><AdminPanel /></motion.div>} />
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
    '/assets/Aesthetical%20living%20space.mp4', '/assets/video.mp4', '/assets/Contemporary%20living%20suite.jpg', '/assets/Living%20Space.mp4',
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
    '/assets/classy%20wardrobe.jpg', '/assets/Hall%20Space.jpg', '/assets/v18.mp4', '/assets/v19.mp4', '/assets/v22.mp4'
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
    '/assets/Hall%20Space.jpg': {
      title: 'Grand Hall Drapery',
      description: 'Double-height hall featuring layered sheers and slate drapery framing a statement chandelier'
    },
    '/assets/v18.mp4': {
      title: 'Curtain Reveal Showcase',
      description: 'Flowing automated drapery opening to unveil a softly lit living space'
    },
    '/assets/v19.mp4': {
      title: 'Luxury Curtain Installation',
      description: 'Two-story feature window dressed with tailored charcoal panels and sheer center layering'
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
    },
    '/assets/Aesthetical%20living%20space.mp4': {
      title: 'Aesthetical Living Space',
      description: 'A beautifully designed living space showcasing elegant aesthetics, premium furniture, and sophisticated interior design elements'
    },
    '/assets/v22.mp4': {
      title: 'Demargo Elite Showcase',
      description: 'Our latest masterpiece featuring high-end interior finishes and premium craftsmanship'
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
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 card-perspective-container">
        {[
          '/assets/Aesthetical%20living%20space.mp4', '/assets/video.mp4', '/assets/Contemporary%20living%20suite.jpg', '/assets/Living%20Space.mp4',
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
          '/assets/classy%20wardrobe.jpg', '/assets/Hall%20Space.jpg', '/assets/v18.mp4', '/assets/v19.mp4', '/assets/v22.mp4'
        ].map((src, i) => {
          const project = projectDescriptions[src] || {
            title: `Project ${i + 1}`,
            description: 'Premium interior design project showcasing our expertise and craftsmanship'
          }
          return (
            <motion.article
              key={`itm-${i}`}
              initial={{ opacity: 0, y: 45, scale: 0.96, rotateX: 6 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
              style={{ transformOrigin: 'bottom center' }}
              className="group relative rounded-2xl overflow-hidden bg-white card-glow card-hover perspective-card"
            >
              <button className="relative w-full text-left" onClick={() => openLightbox(src, src.endsWith('.mp4') ? 'video' : 'image')}>
                {src.endsWith('.mp4') ? (
                  <video src={src} muted playsInline loop autoPlay className="w-full h-64 object-cover" />
                ) : (
                  <img src={src} alt={`Portfolio ${i + 1}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                {/* Hover overlay with project description */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/95 via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="w-full px-4 py-4">
                    <p className="text-xs font-semibold tracking-widest uppercase text-white/80 mb-1">DEMARGO INTERIOR</p>
                    <h3 className="text-base font-bold text-white flex items-center gap-1">{project.title} <span className="text-lg">›</span></h3>
                    <p className="text-sm text-white/90 leading-relaxed mt-1">{project.description}</p>
                  </div>
                </div>
              </button>
            </motion.article>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/95 via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="w-full px-4 py-4">
                      <p className="text-xs font-semibold tracking-widest uppercase text-white/80 mb-1">DEMARGO INTERIOR</p>
                      <h3 className="text-base font-bold text-white flex items-center gap-1">{project.title} <span className="text-lg">›</span></h3>
                      <p className="text-sm text-white/90 leading-relaxed mt-1">{project.description}</p>
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
                <video src={lightbox.src || '/assets/video.mp4'} autoPlay muted loop playsInline className="w-full h-[70vh] object-contain bg-black" />
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

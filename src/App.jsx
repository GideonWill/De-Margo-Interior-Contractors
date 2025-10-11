import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function Seo({ title, description }) {
  const loc = window.location.pathname
  useEffect(() => {
    document.title = title ? title + ' • Demargo Interior Contractors' : 'Demargo Interior Contractors'
  }, [title])
  return (
    <Helmet>
      <meta name="description" content={description || 'Demargo Interior Contractors - premium interior decoration and fitting services in Ghana and Africa.'} />
      <meta property="og:site_name" content="Demargo Interior Contractors" />
      <meta property="og:url" content={window.location.origin + loc} />
    </Helmet>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0,0), [pathname])
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
        <button aria-label="Open menu" className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded border text-gray-700" onClick={()=>setOpen(o=>!o)}>
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
          <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
          <li><NavLink to="/contact" className={({isActive}) => `px-3 py-2 rounded-md text-white transition-colors ${isActive ? 'bg-demargo-blue' : 'bg-demargo-orange hover:opacity-90'}`}>Contact</NavLink></li>
        </ul>
      </nav>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <ul className="grid gap-2 text-sm">
              <li><NavLink onClick={()=>setOpen(false)} to="/" className={linkClass}>Home</NavLink></li>
              <li><NavLink onClick={()=>setOpen(false)} to="/portfolio" className={linkClass}>Portfolio</NavLink></li>
              <li><NavLink onClick={()=>setOpen(false)} to="/services" className={linkClass}>Services</NavLink></li>
              <li><NavLink onClick={()=>setOpen(false)} to="/fabrics" className={linkClass}>Fabric Display</NavLink></li>
              <li><NavLink onClick={()=>setOpen(false)} to="/clientele" className={linkClass}>Clientele</NavLink></li>
              <li><NavLink onClick={()=>setOpen(false)} to="/about" className={linkClass}>About</NavLink></li>
              <li><NavLink onClick={()=>setOpen(false)} to="/contact" className={({isActive}) => `px-3 py-2 rounded-md text-white inline-block ${isActive ? 'bg-demargo-blue' : 'bg-demargo-orange hover:opacity-90'}`}>Contact</NavLink></li>
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
        if (e.isIntersecting) v.play().catch(()=>{})
        else v.pause()
      })
    }, { threshold: 0.25 })
    obs.observe(v)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const revealObs = new IntersectionObserver((entries)=>{
      entries.forEach((e)=>{
        if (e.isIntersecting) e.target.classList.add('is-visible')
      })
    }, { threshold: 0.15 })
    revealRefs.current.forEach((el)=> el && revealObs.observe(el))
    return () => revealObs.disconnect()
  }, [])

  return (
    <main>
      <Seo title="Home" description="Demargo Interior Contractors - custom curtains, blinds, renovation, woodwork and smart home systems across Ghana & Africa." />
      {/* HERO - Updated to Serene Master Retreat with Demargo theme */}
      <section className="relative h-[82vh] md:h-[90vh] flex items-center overflow-hidden bg-slate-900">
        <img
          src="/assets/Executive%20Dining%20Experience.jpg"
          alt="Luxury interior hero"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.8] transform scale-[0.98]"
          ref={videoRef}
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

      {/* ABOUT SNAPSHOT SECTION (second screenshot) */}
      <section ref={el=>revealRefs.current[0]=el} className="reveal max-w-6xl mx-auto px-4 py-16">
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
          <div className="panel-glass p-2 card-glow">
            <img src="/assets/hero%201.jpg" alt="About Demargo" className="aspect-video rounded-2xl w-full h-auto object-cover overflow-hidden" />
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW (third screenshot tone) */}
      <section ref={el=>revealRefs.current[1]=el} className="reveal max-w-6xl mx-auto px-4 py-16">
        <div className="text-demargo-orange font-semibold text-center">OUR SERVICES</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mt-2">Comprehensive Interior Solutions</h2>
        <p className="text-center text-gray-600 mt-3 max-w-3xl mx-auto">From custom curtains to sophisticated lighting, we offer complete interior design services that transform your space into a masterpiece of luxury and functionality.</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Living Room Setting', img: '/assets/hero%20pic.jpg' },
            { title: 'Lighting System', img: '/assets/Lighting%20design.jpg' },
            { title: 'Bedroom Styling', img: '/assets/custom%20curtains.jpg' },
            { title: '3D Rendering', img: '/assets/d2.jpg' }
          ].map((s,i)=> (
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
      <section ref={el=>revealRefs.current[2]=el} className="reveal max-w-6xl mx-auto px-4 py-16">
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
            { img: '/assets/e1.jpg', tag: 'LUXURY DINING', title: 'Modern Dining Experience', idx: 4 },
            { img: '/assets/e2.jpg', tag: 'PREMIUM INTERIOR', title: 'Elegant Living Space', idx: 5 }
          ].map((item,i)=> (
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
                <p className="mt-3 text-gray-700">{i===0 ? 'Stunning modern living space featuring sophisticated furniture arrangements, premium textiles, and carefully curated lighting that creates an atmosphere of understated luxury.' : i===1 ? 'Elegant bedroom sanctuary featuring luxury bedding, custom window treatments, and thoughtful lighting design that promotes rest and relaxation.' : i===2 ? 'Sophisticated dining space showcasing modern furniture, elegant ceiling treatments, and premium finishes that create the perfect atmosphere for memorable gatherings.' : i===3 ? 'Contemporary dining room featuring modern furniture, elegant lighting fixtures, and premium finishes that create an atmosphere of luxury and sophistication.' : 'Spacious living area with modern furniture arrangements, premium lighting design, and thoughtful interior styling that creates a welcoming and elegant atmosphere.'}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(i===0 ? ['Modern Furniture','Premium Textiles','Ambient Lighting'] : i===1 ? ['Custom Bedding','Window Treatments','Mood Lighting'] : i===2 ? ['Modern Dining Set','Ceiling Design','Premium Finishes'] : i===3 ? ['Dining Furniture','Lighting Design','Premium Materials'] : ['Modern Seating','Lighting Systems','Interior Styling']).map((t,j)=> (
                    <span key={j} className="tag-pill">{t}</span>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/portfolio" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-demargo-blue text-white hover:opacity-90 active:scale-[.98]">View Full Project
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
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
      <section ref={el=>revealRefs.current[3]=el} className="reveal bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-center text-4xl md:text-5xl font-extrabold">What Our Clients Say</h2>
          <p className="text-center text-white/80 mt-3 max-w-3xl mx-auto">Don't just take our word for it. Here's what our satisfied clients have to say about their Demargo experience.</p>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {[{n:'Adom Bright',r:'Homeowner',q:'Demargo transformed our living space beyond our expectations. The attention to detail and quality of work is exceptional.'},{n:'Ayi Homes',r:'Developer',q:'Professional, timely, and absolutely stunning results. Our spaces now reflect the quality of our brand.'}].map((t,i)=> (
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
      <section ref={el=>revealRefs.current[4]=el} className="reveal max-w-6xl mx-auto px-4 pb-16">
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
  const allServices = [
    {
      title: 'Interior Design',
      desc: 'We create custom‑designed interiors that reflect your lifestyle, personality, and space needs.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18"/><path d="M6 7v13"/><path d="M18 7v13"/><path d="M6 20h12"/><path d="M9 7V4h6v3"/></svg>
      )
    },
    {
      title: 'Home Renovation',
      desc: 'From kitchen upgrades to full remodels, we handle all aspects of home renovation.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/></svg>
      )
    },
    {
      title: '3D Rendering and Visualization',
      desc: 'Visualize your interior project in real‑time form with high‑quality 3D renders.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/></svg>
      )
    },
    {
      title: 'Curtains and Blinds Installation',
      desc: 'Fabric selection, measurement, and flawless installation for homes and offices.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18"/><path d="M4 3v18"/><path d="M8 3v18"/><path d="M12 3v18"/><path d="M16 3v18"/><path d="M20 3v18"/></svg>
      )
    },
    {
      title: 'Smart Home Installation',
      desc: 'Lighting automation, security, and remote‑controlled systems tailored to your lifestyle.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l7 7v11H5V9l7-7z"/><path d="M9 13h6v6H9z"/></svg>
      )
    },
    {
      title: 'POP Ceiling Designs',
      desc: 'Modern ceiling finishes that add depth, beauty, and sophistication to any room.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18"/><path d="M6 10h12"/><path d="M9 13h6"/></svg>
      )
    },
    {
      title: 'Painting',
      desc: 'Professional interior and exterior painting using high‑quality materials and techniques.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3h10v6H3z"/>
          <path d="M13 5h8"/>
          <path d="M13 8h6"/>
          <path d="M7 9v10a2 2 0 002 2h2a2 2 0 002-2V9"/>
        </svg>
      )
    },
    {
      title: 'Tiling',
      desc: 'Durable, stylish floors and wall tiling for bathrooms, kitchens, offices and showrooms.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      )
    },
    {
      title: 'Cleaning Services',
      desc: 'Post‑construction and deep cleaning to ensure your space is spotless, safe, and move‑in ready.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18"/><path d="M6 12V6a3 3 0 013-3h6a3 3 0 013 3v6"/><path d="M6 12l2 9h8l2-9"/></svg>
      )
    }
  ]

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
        {allServices.slice(0,2).map((s,i)=> (
          <article key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-demargo-blue mb-2">{s.icon}</div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </article>
        ))}
            </div>

      {/* Remaining grid */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {allServices.slice(2,8).map((s,i)=> (
          <article key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-demargo-blue mb-2">{s.icon}</div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </article>
        ))}
          </div>

      {/* Cleaning full width */}
      <div className="mt-6">
        {allServices.slice(8,9).map((s,i)=> (
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

function Fabrics() {
  const [lightbox, setLightbox] = useState({ open: false, src: '', kind: 'image' })
  const openLightbox = (src) => setLightbox({ open: true, src, kind: 'image' })
  const closeLightbox = () => setLightbox({ open: false, src: '', kind: 'image' })
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Fabric Display" description="Browse Demargo's curated fabric samples for curtains and upholstery." />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-center">
        <span className="text-demargo-orange">Fabric</span> <span className="text-demargo-blue">Display</span>
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Browse a curated selection of premium fabrics. Tap any tile to preview in a larger view.</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[
          {file:'1.png', code:'MILAN-7'},
          {file:'2.png', code:'8021-04'},
          {file:'3.png', code:'MILAN-9'},
          {file:'4.png', code:'8021-05'},
          {file:'5.png', code:'MILAN-10'},
          {file:'6.png', code:'8021-09'}
        ].map((f,i)=>(
          <figure key={i} className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100">
            <button className="relative w-full block" onClick={()=>openLightbox(`/assets/${f.file}`)}>
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
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </a>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-5 text-center">Blinds</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {['/assets/b1.jpg','/assets/b2.jpg','/assets/s2.jpg','/assets/s1.jpg','/assets/s4.jpg','/assets/s7.jpg'].map((src,i)=>(
          <figure key={i} className="group rounded-2xl overflow-hidden bg-white card-hover shadow border border-gray-100">
            <button className="relative w-full" onClick={()=>openLightbox(src)}>
              <img src={src} alt={`Blind ${i+1}`} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </button>
          </figure>
        ))}
      </div>

      {lightbox.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="max-w-5xl w-full" onClick={(e)=>e.stopPropagation()}>
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
  const clients = [
    { name: 'Ayi Mensah Park by Indigo Homes', img: '/assets/Ayi%20Mensah%20Park%20by%20Indigo%20Homes.jpeg' },
    { name: 'Bel Rose Place', img: '/assets/Bel%20Rose%20Place.jpeg' },
    { name: 'Cantoment Gardens', img: '/assets/Cantoment%20Gardens.jpg' },
    { name: 'City Galleria', img: '/assets/City%20Galleria.jpeg' },
    { name: 'Contemporary living suite', img: '/assets/Contemporary%20living%20suite.jpg' },
    { name: 'Embassy Gardens', img: '/assets/Embassy%20Gardens.jpg' },
    { name: 'Harvey Terraces', img: '/assets/Harvey%20Terraces.jpeg' },
    { name: 'Flagstaff House', img: '/assets/flagstaff%20house.jpg' },
    { name: 'Holiday Inn Hotel', img: '/assets/Holiday%20Inn%20Hotel.jpg' },
    { name: 'Loxwood House', img: '/assets/Loxwood%20House.jpg' },
    { name: 'Lindsay Square', img: '/assets/Lindsay%20Square.jpg' },
    { name: 'Nova by Devtraco Plus', img: '/assets/Nova%20by%20Devtraco%20Plus.jpg' },
    { name: 'Narcotics Control Commission', img: '/assets/Narcotics%20Control%20Commission.png' },
    { name: 'Oyarifa Park by Indigo Homes', img: '/assets/Oyarifa%20Park%20by%20Indigo%20Homes.jpeg' },
    { name: 'Silicon Valley', img: '/assets/Silicon%20Valley.jpeg' },
    { name: 'The Lennox Apartments', img: '/assets/The%20Lennox%20Apartments.jpg' },
    { name: 'The Palms - Kaybee Gardens', img: '/assets/The%20Palms%20-%20Kaybee%20Gardens.jpeg' },
    { name: 'The Signature Apartments', img: '/assets/The%20Signature%20Apartments.jpg' },
    { name: 'Tribute House', img: '/assets/Tribute%20House.jpeg' },
    { name: 'Ashanti Gardens', img: '/assets/Ashanti%20Gardens.jpeg' },
    { name: 'Williot Constructions', img: '/assets/Williot%20Constructions.png' },
  ]
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Clientele" description="Some of the clients Demargo Interior Contractors has served." />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-center">
        <span className="text-demargo-orange">Our</span> <span className="text-demargo-blue">Esteemed Clients</span>
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">A selection of brands, residences, and developments we’ve had the privilege to style and fit with premium interior solutions.</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
        {clients.map((c,i)=>(
          <figure key={i} className="group rounded-2xl overflow-hidden bg-white shadow transition hover:shadow-lg border border-gray-100 hover:-translate-y-0.5">
            <img src={c.img} alt={c.name} className="w-full aspect-[4/3] object-cover" />
            <figcaption className="px-4 py-3 text-sm text-gray-800 font-medium text-center bg-slate-50 border-t">{c.name}</figcaption>
          </figure>
        ))}
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
            {['Insured & Certified','Dedicated Project Managers','Trusted Vendor Network','After‑service Support'].map((b,i)=>(
              <div key={i} className="p-4 rounded-lg bg-gradient-to-r from-demargo-orange/10 to-demargo-blue/10 border">{b}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">Leadership</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Blessing Kesinornu', role: 'Managing Director', img: '/assets/Kessy.jpg' },
            { name: 'George Nettey', role: 'Head of Media', img: '/assets/George.jpg' },
            { name: 'Micheal Martey', role: 'Head of Installation', img: '/assets/MDK.jpg' },
            { name: 'Samuel Nettey', role: 'Head of Measurements', img: '/assets/Omar.jpg' }
          ].map((m,i)=>(
            <figure key={i} className="rounded-xl overflow-hidden bg-white text-center shadow-sm">
              <img src={m.img} alt={m.name} className="w-full h-60 md:h-52 object-contain md:object-cover bg-slate-100" />
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



function Contact() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Seo title="Contact / Booking" description="Contact Demargo to schedule a consultation or request a quote." />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-center">Let's Create Something Amazing Together</h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Reach us via phone, WhatsApp, or email. You can also find our working hours and location below.</p>
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <a href="tel:+233546478040" className="inline-flex items-center justify-center px-4 py-3 rounded-md bg-demargo-orange text-white font-medium hover:opacity-90">Call Us</a>
              <a href="https://wa.me/233546478040" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-4 py-3 rounded-md border font-medium">WhatsApp Us</a>
              <a href="mailto:demargo1987@gmail.com" className="inline-flex items-center justify-center px-4 py-3 rounded-md bg-demargo-blue text-white font-medium hover:opacity-90">Send Email</a>
            </div>
          </div>
          <div className="mt-6 bg-white rounded-2xl shadow border border-gray-100 p-6">
            <div className="text-lg font-semibold mb-3 flex items-center gap-2"><span>📍</span>Live Map</div>
            <div className="rounded-xl overflow-hidden">
              <iframe
                title="Demargo Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent('Demargo Contractors, HM8Q+XJR, Gbawe')}&output=embed`}
                className="w-full h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Demargo Contractors, HM8Q+XJR, Gbawe')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-white border"
            >
              Get Directions
            </a>
          </div>
        </div>
        <aside className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <div className="text-lg font-semibold mb-3">Contact Info</div>
          <div className="text-sm text-gray-700 space-y-2">
            <div>Phone: 0546478040</div>
            <div>Email: demargo1987@gmail.com</div>
            <div>Address: Demargo Contractors, HM8Q+XJR, Gbawe</div>
            <div className="pt-2 border-t"><span className="font-medium">Hours:</span> Mon–Fri 8AM–5PM, Sat 8AM–4PM</div>
          </div>
        </aside>
      </div>
    </section>
  )
}

/* Simple floating chat widget (single instance, toggles panel) */
// Chat widget removed per request

/* Helper component: auto-play video on scroll, muted */
function VideoReveal({ src, className }) {
  const vref = React.useRef(null)
  React.useEffect(()=>{
    const v = vref.current
    if (!v) return
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if (e.isIntersecting) {
          v.loop = true
          v.play().catch(()=>{})
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
  React.useEffect(()=>{
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
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
    </button>
  )
}

/* Simple on-site FAQ ChatBot (client-only, placeholder for API integration) */
function ChatBot() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([
    { role: 'bot', text: 'Hi! I\'m Demargo Assistant. Ask about services, booking, fabrics, or hours.' }
  ])
  const [input, setInput] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const faq = [
    { q: /hour|open|close|time/i, a: 'We\'re open Mon–Fri 8AM–5PM, Sat 8AM–4PM.' },
    { q: /contact|phone|email/i, a: 'Phone: 0546478040 • Email: demargo1987@gmail.com' },
    { q: /service|offer|do you/i, a: 'We offer interior design, renovations, curtains & blinds, lighting, POP ceilings, smart home, painting, tiling, and cleaning.' },
    { q: /book|quote|consult/i, a: 'You can book via the Contact page: call, WhatsApp, or email. We\'ll schedule a site visit and provide a quote.' },
    { q: /location|address/i, a: 'Address: Demargo Contractors, HM8Q+XJR, Gbawe.' }
  ]
  const onSend = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)
    const match = faq.find(f => f.q.test(userMsg.text))
    const botMsg = { role: 'bot', text: match ? match.a : 'Thanks! A specialist will follow up. Meanwhile, view Services and Portfolio for details.' }
    setTimeout(()=>{
      setMessages(m => [...m, botMsg])
      setTyping(false)
    }, 650)
  }
  return (
    <div className="fixed bottom-20 right-6 z-50">
      {open && (
        <div className="mb-3 w-80 max-w-[90vw] rounded-2xl bg-white shadow-2xl border overflow-hidden transition-all duration-300 ease-out transform origin-bottom-right">
          <div className="px-4 py-3 bg-gradient-to-r from-demargo-orange/90 to-demargo-blue/90 text-white flex items-center justify-between">
            <div className="font-semibold">Demargo Assistant</div>
            <button onClick={()=>setOpen(false)} className="opacity-90 hover:opacity-100">×</button>
          </div>
          <div className="max-h-80 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m,i)=> (
              <div key={i} className={m.role==='bot' ? 'text-gray-800' : 'text-right'}>
                <span className={`inline-block px-3 py-2 rounded-lg ${m.role==='bot' ? 'bg-slate-100' : 'bg-demargo-blue text-white'}`}>{m.text}</span>
              </div>
            ))}
            {typing && (
              <div className="text-gray-800">
                <span className="inline-block px-3 py-2 rounded-lg bg-slate-100 animate-pulse">Typing…</span>
              </div>
            )}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onSend()} placeholder="Type your question..." className="flex-1 px-3 py-2 rounded-md border outline-none" />
            <button onClick={onSend} className="px-4 py-2 rounded-md bg-demargo-orange text-white">Send</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(v=>!v)} className="rounded-full w-12 h-12 shadow-xl bg-gradient-to-tr from-demargo-orange to-demargo-blue text-white flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 00-9 9 9 9 0 009 9h6l3 3v-6a9 9 0 00-9-15z"/></svg>
      </button>
    </div>
  )
}
export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 text-gray-900 overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/fabrics" element={<Fabrics />} />
          <Route path="/clientele" element={<Clientele />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <BackToTop />
        <ChatBot />
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
                <li>Curtain Installation</li>
                <li>Blind Installation</li>
                <li>Lighting Design</li>
                <li>Bedroom Arrangements</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Company</div>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/fabrics">Fabric Library</Link></li>
                <li><Link to="/clientele">Our Clientele</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Follow</div>
              <div className="flex gap-4 text-white/90 text-xl">
                <a href="https://www.facebook.com/share/1Jui7wFk7G/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H17l-.5 3h-2.3v7A10 10 0 0022 12z"/></svg>
                </a>
                <a href="https://instagram.com/demargo_blinds_curtains" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z"/></svg>
                </a>
                <a href="https://www.tiktok.com/@demargo_blinds?_t=ZM-90QcyZHzNTE&_r=1" target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 7a5 5 0 015-5h1c.2 2.1 1.6 3.9 3.6 4.6A7 7 0 0021 7v3a9 9 0 01-4.5-1.3v6.2A6.9 6.9 0 019.5 22 5.5 5.5 0 019 11.1V13a3.5 3.5 0 103.5 3.5V2H14a3 3 0 00-3 3v2H9z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/de-margo-interior-contractors-5a6153262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-.9 1.8-2.2 3.7-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.1c0-1.7 0-3.9-2.4-3.9-2.4 0-2.8 1.8-2.8 3.8V24h-4V8z"/></svg>
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

function Portfolio() {
  const [lightbox, setLightbox] = React.useState({ open: false, src: '', kind: 'image' })
  const openLightbox = (src, kind) => setLightbox({ open: true, src, kind })
  const closeLightbox = () => setLightbox({ open: false, src: '', kind: 'image' })
  const items = [
    '/assets/Contemporary%20living%20suite.jpg',
    '/assets/video.mp4',
    '/assets/Serene%20Master%20Retreat.jpg',
    '/assets/Executive%20Dining%20Experience.jpg',
    '/assets/v1.mp4','/assets/v2.mp4','/assets/v3.mp4','/assets/v4.mp4','/assets/v5.mp4',
    '/assets/v6.mp4','/assets/v7.mp4','/assets/v8.mp4','/assets/v9.mp4','/assets/v10.mp4',
    '/assets/v11.mp4','/assets/v12.mp4','/assets/v13.mp4','/assets/v14.mp4','/assets/v15.mp4','/assets/v16.mp4',
    '/assets/Lighting%20design.jpg','/assets/custom%20curtains.jpg'
  ]
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

      {/* Portfolio grid - shuffled, no tags */}
      {(() => {
        const gridItems = [
          '/assets/Contemporary%20living%20suite.jpg', '/assets/s10.jpg', '/assets/video.mp4', '/assets/Serene%20Master%20Retreat.jpg', '/assets/Executive%20Dining%20Experience.jpg',
          '/assets/v2.mp4','/assets/v3.mp4','/assets/v4.mp4','/assets/v1.mp4',
          '/assets/Lighting%20design.jpg','/assets/custom%20curtains.jpg',
          '/assets/s2.jpg','/assets/s3.jpg','/assets/s4.jpg','/assets/s5.jpg','/assets/s6.jpg','/assets/s7.jpg','/assets/s8.jpg','/assets/s9.jpg','/assets/s10.jpg','/assets/s11.jpg','/assets/c4.jpg','/assets/c3.jpg','/assets/c1.jpg','/assets/d1.jpg','/assets/d2.jpg','/assets/d3.jpg','/assets/d4.jpg','/assets/d5.jpg'
        ]
        const shuffled = React.useMemo(() => [...gridItems].sort(() => Math.random() - 0.5), [])
        return (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shuffled.map((src,i)=> (
              <article key={`itm-${i}`} className="group relative rounded-2xl overflow-hidden bg-white card-glow card-hover">
                <button className="relative w-full text-left" onClick={()=>openLightbox(src, src.endsWith('.mp4')?'video':'image')}>
                  {src.endsWith('.mp4') ? (
                    <video src={src} muted playsInline loop autoPlay className="w-full h-64 object-cover" />
                  ) : (
                    <img src={src} alt={`Portfolio ${i+1}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </button>
              </article>
            ))}
          </div>
        )
      })()}

      {/* Hero-style video showcase */}
      <section className="mt-12">
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[50vh] md:h-[75vh] overflow-hidden">
          <VideoReveal src="/assets/v5.mp4" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        {/* Removed typing heading per request */}
        <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['/assets/v6.mp4','/assets/v7.mp4','/assets/v8.mp4'].map((src,i)=>(
            <article key={`vmore-${i}`} className="group relative rounded-2xl overflow-hidden bg-white card-glow">
              <button className="relative w-full" onClick={()=>openLightbox(src,'video')}>
                <video src={src} muted playsInline loop autoPlay className="w-full h-64 object-cover" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {lightbox.open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="max-w-5xl w-full" onClick={(e)=>e.stopPropagation()}>
            <div className="relative w-full overflow-hidden rounded-lg bg-black">
              {lightbox.kind === 'video' ? (
                <video src={lightbox.src || '/assets/video.mp4'} controls autoPlay muted className="w-full h-[70vh] object-contain bg-black" />
              ) : (
                <img src={lightbox.src} alt="preview" className="w-full h-[70vh] object-contain bg-black" />
              )}
            </div>
            <div className="mt-3 flex justify-between">
              <button onClick={()=>setLightbox(p=>({ ...p, src: getAdjacentSrc(p.src, -1), kind: inferKind(getAdjacentSrc(p.src, -1)) }))} className="inline-flex px-4 py-2 rounded bg-white/90 text-gray-800">Prev</button>
              <button onClick={closeLightbox} className="inline-flex px-4 py-2 rounded bg-white text-gray-800">Close</button>
              <button onClick={()=>setLightbox(p=>({ ...p, src: getAdjacentSrc(p.src, 1), kind: inferKind(getAdjacentSrc(p.src, 1)) }))} className="inline-flex px-4 py-2 rounded bg-white/90 text-gray-800">Next</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

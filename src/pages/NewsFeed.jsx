import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet'
import { Link, useLocation } from 'react-router-dom'

export const NEWS_ARTICLES = [
  {
    id: 'award-winning-interior-design-2026',
    slug: 'demargo-crowned-interior-design-company-2026',
    title: 'Demargo Interior Contractors Crowned Interior Design Company of the Year 2026',
    category: 'Awards & Recognition',
    date: 'October 2026',
    publishedDate: '2026-10-01',
    readTime: '4 min read',
    author: 'Demargo Editorial',
    image: '/assets/Award%20Winning%20Interior%20Design%202026.png',
    secondaryImage: '/assets/AwardWinning%20Interior%20Design%20Trophy.png',
    featured: true,
    excerpt: 'Demargo has been officially recognized at the prestigious Ghana Business Standard Awards for pioneering excellence in bespoke curtain styling, automated shading, and luxury residential interior transformations.',
    summary: 'A momentous milestone celebrating 8+ years of craft, innovation, and client satisfaction across residential and commercial developments in Ghana.',
    citationNote: 'Ghana Business Standard Awards 2026. Conferred upon Demargo Interior Contractors for pioneering industry standards in bespoke curtain drapery and architectural aesthetics.',
    body: [
      'We are deeply honored and thrilled to announce that Demargo Interior Contractors has been officially crowned "Interior Design Company of the Year 2026" at the prestigious Ghana Business Standard Awards.',
      'This esteemed citation acknowledges our relentless dedication to delivering high-precision custom curtains, luxury blinds, and holistic interior architectural transformations across Ghana.',
      'Since our inception in 2018, our guiding mantra has been simple yet uncompromising: Reliable, High Class, Great Ambience. From private residences in Airport Residential, Cantonments, and East Legon, to sprawling commercial complexes and state institutions, every fabric cut and track installed represents our hallmark of precision.',
      '"This award belongs first and foremost to our esteemed clients, whose visionary spaces challenge us to redefine interior aesthetics every single day," stated the Demargo Executive Director during the citations gala.',
      'As we celebrate this milestone, we remain committed to pioneering smart motorization, curated international fabric collections, and transparent client project tracking that set the benchmark for interior craftsmanship.'
    ],
    tags: ['Awards', 'Excellence', 'Ghana Business Standard Awards', 'Milestone']
  },
  {
    id: 'ghana-armed-forces-award',
    slug: 'ghana-armed-forces-excellence-award',
    title: 'Ghana Armed Forces Honors Demargo for Excellence in Interior Design Services',
    category: 'Awards & Recognition',
    date: 'Honorary Citation',
    publishedDate: '2026-08-10',
    readTime: '3 min read',
    author: 'Demargo Executive Office',
    image: '/assets/awards%20GAF.jpg',
    secondaryImage: '/assets/award.jpg',
    logo: '/assets/GAF.jpg',
    featured: false,
    excerpt: 'The Ghana Armed Forces Command and Staff College (GAFCSC) officially presented Demargo with a distinguished citation recognizing excellence in service, institutional support, and transformational interior execution.',
    summary: 'A prestigious institutional honor presented by the leadership of the Ghana Armed Forces Command and Staff College in appreciation of Demargo’s high-standard execution and unwavering service delivery.',
    citationNote: 'Presented by the Ghana Armed Forces Command and Staff College (GAFCSC) in appreciation of generous support, recognizing meaningful contribution and service to national defense education.',
    body: [
      'Demargo Interior Contractors is profoundly honored to have received an official Award Citation from the Ghana Armed Forces Command and Staff College (GAFCSC).',
      'Presented directly by the military high command, this distinguished citation recognizes Demargo’s generous institutional support, disciplined execution, and meaningful contributions toward elevating military educational facilities and executive quarters.',
      'Working with state security and defense institutions demands an elite tier of professionalism: uncompromising precision, strict timeline compliance, and materials built to withstand intensive daily institutional use.',
      'Our customized drapery, acoustic sound-proofing, and tailored fitting solutions installed across the Ghana Armed Forces command spaces reflect our national commitment to service excellence.',
      '"Receiving recognition from an institution as disciplined and revered as the Ghana Armed Forces affirms that our workmanship meets the highest standards in the country," noted the Demargo project leadership.',
      'We express our deepest gratitude to the Command and Staff College leadership for their trust and continued partnership as we serve key national institutions with pride.'
    ],
    tags: ['Ghana Armed Forces', 'GAFCSC', 'Institutional Award', 'Service Excellence', 'Government']
  },
  {
    id: 'smart-motorized-curtains-ghana',
    slug: 'the-rise-of-smart-motorized-curtains-ghana',
    title: 'The Rise of Smart Motorized Curtains & Acoustic Drapery in Modern Ghanaian Homes',
    category: 'Tech & Innovation',
    date: 'September 2026',
    publishedDate: '2026-09-18',
    readTime: '3 min read',
    author: 'Design & Tech Lab',
    image: '/assets/Luxury%20Living%20space.jpg',
    secondaryImage: '/assets/Hall%20Space.jpg',
    featured: false,
    excerpt: 'Discover how remote-controlled and smartphone-operated drapery systems are revolutionizing convenience, energy efficiency, and privacy in Accra and beyond.',
    summary: 'Automated curtain tracks are no longer a luxury reserved for five-star hotels — they are the new standard for contemporary high-ceiling living rooms in Ghana.',
    body: [
      'High ceilings, double-volume glazing, and floor-to-ceiling windows have become architectural hallmarks of contemporary homes in Accra, Kumasi, and Takoradi.',
      'While expansive glass floods homes with beautiful natural light, manually pulling heavy 6-meter drapery multiple times a day can be cumbersome. Enter smart motorized drapery systems.',
      'Demargo now integrates whisper-quiet electric tracks compatible with Tuya, Google Home, Apple HomeKit, and handheld multichannel remotes.',
      'Key Benefits of Motorized Systems in Tropical Climates:',
      '• Automated Schedules: Program curtains to draw during peak afternoon sun (1:00 PM – 3:30 PM), reducing interior heat gain and easing air-conditioning loads.',
      '• Preservation of High-End Fabrics: Touch-free operation eliminates hand friction, preventing fabric staining or accidental pull damage on sheer linens and silks.',
      '• Acoustic Comfort: Paired with multi-layered sound-dampening velvet linings, motorized curtains significantly dampen echo in open-concept living rooms.'
    ],
    tags: ['Smart Home', 'Motorized Curtains', 'Energy Efficiency', 'Modern Living']
  },
  {
    id: 'corporate-boardroom-transformation',
    slug: 'corporate-boardroom-drapery-overhaul',
    title: 'Inside the Transformation: High-End Corporate Drapery for Executive Boardrooms',
    category: 'Project Spotlight',
    date: 'August 2026',
    publishedDate: '2026-08-22',
    readTime: '5 min read',
    author: 'Commercial Projects Team',
    image: '/assets/Executive%20Dining%20Experience.jpg',
    featured: false,
    excerpt: 'A closer look at how Demargo tailored sound-absorbing acoustic blackout curtains and ripple fold tracks for one of Ghana’s leading financial institutions.',
    summary: 'How corporate acoustic drapery helped eliminate conference room echo while delivering a dignified, world-class aesthetic for hybrid shareholder meetings.',
    body: [
      'Executive boardrooms demand a delicate balance between prestigious design aesthetics and acoustic clarity. When glass-paneled meeting rooms suffer from echo and glare during international video conferences, presentation quality suffers.',
      'Demargo was contracted to design, tailor, and fit custom ceiling-recessed ripple fold curtains for an executive boardroom in central Accra.',
      'The Scope of Works:',
      '• Triple-weave flame-retardant blackout fabric combined with high-density acoustic core linings.',
      '• Zero-noise ceiling tracks concealed within bespoke architectural bulkheads.',
      '• Deep charcoal and warm bronze tones complementing custom mahogany conference furnishings.',
      'The outcome was a 42% reduction in sound reverberation during hybrid calls and a dramatic transformation in visual prestige.'
    ],
    tags: ['Commercial', 'Corporate', 'Acoustics', 'Case Study']
  },
  {
    id: 'velvet-vs-linen-tropical-climate',
    slug: 'velvet-vs-linen-ghana-tropical-climate',
    title: 'Fabric Selection Guide: Velvet vs. Linen for Ghana’s Tropical Climate',
    category: 'Design Guides',
    date: 'July 2026',
    publishedDate: '2026-07-14',
    readTime: '4 min read',
    author: 'Fabric Consultancy Unit',
    image: '/assets/Fabric%20Selection%20Swatches.png',
    featured: false,
    excerpt: 'Choosing the right drapery material can be tricky with humidity and sunlight. Here is our expert guide to longevity, thermal insulation, and aesthetic elegance.',
    summary: 'A direct comparison of fabric weights, breathability, light filtration, and maintenance to help you choose the ideal curtain fabric.',
    body: [
      'Choosing curtains for a home in West Africa requires thoughtful balance between visual grandeur and climate resistance. High humidity, intense coastal ultraviolet light, and dust can take a toll on low-quality fabrics.',
      'When Should You Choose Royal Velvet?',
      '• Ideal For: Master bedroom suites, home theaters, and formal dining rooms.',
      '• Strengths: Rich, opulent texture, supreme blackout capabilities, and exceptional acoustic warmth.',
      '• Pro Tip: Always opt for high-durability synthetic or blended velvet with color-fast UV treatment to prevent sun-fading on south-facing windows.',
      'When Should You Choose Premium Linen & Sheers?',
      '• Ideal For: Sunrooms, living spaces, breakfast areas, and balconies.',
      '• Strengths: Breathable, airy, allows diffused gentle daylight while maintaining daytime privacy.',
      '• Pro Tip: Pair neutral linen drapery with a dual-track sheer layer so you can adjust illumination throughout the day.'
    ],
    tags: ['Fabric Guide', 'Linen', 'Velvet', 'Interior Tips']
  },
  {
    id: 'client-tracking-portal-launch',
    slug: 'demargo-launches-live-project-tracking-portal',
    title: 'Demargo Launches 24/7 Client Live Project Tracking Portal',
    category: 'Company News',
    date: 'June 2026',
    publishedDate: '2026-06-05',
    readTime: '3 min read',
    author: 'Operations & Tech Team',
    image: '/assets/Project%20Tracking%20Portal.png',
    featured: false,
    excerpt: 'Clients can now track site measurement schedules, estimate documentation, fabric tailoring milestones, and installation dates in real time using their phone number.',
    summary: 'Demargo introduces end-to-end digital transparency so you always know the exact progress of your custom drapery and interior fit-out.',
    body: [
      'Renovations and custom interior fit-outs can often cause anxiety when clients are left wondering about tailoring timelines and installation schedules.',
      'To provide total peace of mind, Demargo has launched the Demargo Live Project Tracker — a dedicated client dashboard accessible directly from our website.',
      'How the Portal Works for You:',
      '1. Instant Access: No complex login required. Simply enter your consultation phone number to pull up your project.',
      '2. Lifecycle Stepper: Follow your project across all key phases — Site Measurement, Estimate Review, Fabric Selection, Tailoring/Sewing, and Site Installation.',
      '3. PDF Documents & Receipts: Instantly view your itemized estimate documents, receipts, and measurement logs.',
      '4. Direct Support Chat: Communicate directly with the project managers overseeing your fabrication.'
    ],
    tags: ['Innovation', 'Customer Service', 'Transparency', 'Live Portal']
  },
  {
    id: 'luxury-window-blinds-trends',
    slug: 'zebra-blinds-vs-venetian-wood-blinds',
    title: 'Zebra Blinds vs. Venetian Wood: Which Window Treatment Fits Your Living Space?',
    category: 'Design Guides',
    date: 'May 2026',
    publishedDate: '2026-05-19',
    readTime: '4 min read',
    author: 'Design Trends Team',
    image: '/assets/e2.jpg',
    featured: false,
    excerpt: 'Explore light filtering versatility, privacy options, and modern minimalist styling between custom day-and-night zebra blinds and natural wood blinds.',
    summary: 'A curated comparison to help modern homeowners achieve clean minimalist window styling without sacrificing sun control.',
    body: [
      'Window blinds offer sleek, architectural lines that make compact spaces feel larger and modern rooms feel crisper.',
      'Zebra (Day & Night) Blinds:',
      'Zebra blinds feature alternating stripes of sheer and solid fabric. By slightly adjusting the cord or motor, you can align the stripes to either invite softened daylight or completely block visibility.',
      'Natural Venetian Wood Blinds:',
      'Real wood or premium moisture-resistant faux wood slats bring organic warmth, biophilic elegance, and timeless charm to kitchens, home studies, and bathrooms.',
      'Which Should You Pick?',
      'If you prefer a contemporary, fabric-softened feel with easy motorization, zebra blinds are hard to beat. If you love organic timber textures and crisp horizontal slats, venetian wood blinds provide unmatched architectural dignity.'
    ],
    tags: ['Window Blinds', 'Zebra Blinds', 'Venetian Blinds', 'Decor Ideas']
  }
]

const CATEGORIES = [
  'All Updates',
  'Awards & Recognition',
  'Tech & Innovation',
  'Project Spotlight',
  'Design Guides',
  'Company News'
]

export default function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState('All Updates')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeArticle, setActiveArticle] = useState(null)
  const location = useLocation()

  // Auto-open article if navigated from teaser or direct link
  useEffect(() => {
    if (location.state?.articleId) {
      const match = NEWS_ARTICLES.find(a => a.id === location.state.articleId)
      if (match) {
        setActiveArticle(match)
      }
    }
  }, [location.state])

  // Prevent background scroll and allow native smooth scrolling inside the modal
  useEffect(() => {
    if (activeArticle) {
      const originalHtmlOverflow = document.documentElement.style.overflow
      const originalBodyOverflow = document.body.style.overflow

      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'

      const onKeyDown = (e) => {
        if (e.key === 'Escape') setActiveArticle(null)
      }
      window.addEventListener('keydown', onKeyDown)

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow
        document.body.style.overflow = originalBodyOverflow
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [activeArticle])

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return NEWS_ARTICLES.filter(article => {
      const matchesCategory = selectedCategory === 'All Updates' || article.category === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch = !query || 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query)) ||
        article.body.some(p => p.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  // Featured article (first featured or top item)
  const featuredArticle = NEWS_ARTICLES.find(a => a.featured) || NEWS_ARTICLES[0]

  const handleShareWhatsApp = (article) => {
    const text = encodeURIComponent(
      `Check out this update from Demargo Interior Contractors:\n\n*${article.title}*\n${article.excerpt}\n\nRead more at https://demargointerior.com/news`
    )
    window.open(`https://wa.me/233546738914?text=${text}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 md:py-16">
      <Helmet>
        <title>News & Happenings • Demargo Interior Contractors</title>
        <meta 
          name="description" 
          content="Explore current happenings, major interior design project spotlights, award recognitions, and expert fabric design guides from Demargo Interior Contractors." 
        />
        <meta property="og:title" content="News & Happenings • Demargo Interior Contractors" />
        <meta property="og:description" content="Latest awards, corporate project spotlights, and luxury interior design articles from Demargo Interior Contractors in Ghana." />
        <meta property="og:image" content="/assets/Award%20Winning%20Interior%20Design%202026.png" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-[10px] md:text-xs font-bold uppercase tracking-widest text-demargo-orange shadow-xs">
            <span>●</span> Demargo Journal & Newsroom
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase">
            <span className="text-demargo-orange">Latest News</span>{' '}
            <span className="text-black">& Happenings</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Stay in touch with our prestigious awards, ongoing executive project spotlights, smart home drapery innovations, and seasonal fabric design insights.
          </p>
        </section>

        {/* Search & Category Filter Controls */}
        <section className="bg-white border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, keyword, or topic..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 text-sm text-black placeholder-slate-400 focus:outline-none focus:border-demargo-orange focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-black">{filteredArticles.length}</span> update{filteredArticles.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {CATEGORIES.map(category => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 text-xs font-bold transition uppercase tracking-wider border ${
                    active
                      ? 'bg-black text-demargo-orange border-black shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-black'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </section>

        {/* Featured Hero Story (shown when no specific search is active or matches) */}
        {!searchQuery && selectedCategory === 'All Updates' && featuredArticle && (
          <section className="bg-black text-white border border-slate-800 overflow-hidden shadow-xl grid lg:grid-cols-12 gap-0 relative">
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[340px] overflow-hidden bg-slate-900">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-demargo-orange text-black font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 shadow-md">
                ★ Featured Headline
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-demargo-orange font-bold uppercase tracking-wider">
                  <span>{featuredArticle.category}</span>
                  <span>•</span>
                  <span className="text-slate-400">{featuredArticle.date}</span>
                  <span>•</span>
                  <span className="text-slate-400">{featuredArticle.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight hover:text-demargo-orange transition cursor-pointer" onClick={() => setActiveArticle(featuredArticle)}>
                  {featuredArticle.title}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featuredArticle.tags.map(t => (
                    <span key={t} className="text-[10px] font-semibold bg-white/10 text-slate-300 px-2 py-0.5 border border-white/10">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setActiveArticle(featuredArticle)}
                  className="px-5 py-2.5 bg-demargo-orange text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center gap-2"
                >
                  <span>Read Full Story</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => handleShareWhatsApp(featuredArticle)}
                  className="px-4 py-2.5 bg-white/10 text-white hover:bg-white/20 font-semibold text-xs transition flex items-center gap-1.5 border border-white/15"
                  title="Share via WhatsApp"
                >
                  <span>💬 Share</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* News Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
              {selectedCategory === 'All Updates' ? 'All Recent Happenings' : selectedCategory}
            </h2>
            <span className="text-xs text-slate-500 font-medium">Updated Weekly</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 text-center space-y-4">
              <span className="text-4xl">📰</span>
              <h3 className="text-lg font-bold text-black">No articles found</h3>
              <p className="text-slate-600 text-xs max-w-md mx-auto">
                We couldn't find any articles matching "{searchQuery}". Try selecting another category or clear your search query.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All Updates') }}
                className="px-4 py-2 bg-black text-demargo-orange font-bold text-xs uppercase tracking-wider hover:bg-slate-900 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredArticles.map((article) => {
                return (
                  <article
                    key={article.id}
                    className="bg-white border border-slate-200 hover:border-black flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-lg group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setActiveArticle(article)}>
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-black/90 text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1">
                          {article.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{article.date}</span>
                          <span>{article.readTime}</span>
                        </div>

                        <h3 
                          className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-demargo-orange transition cursor-pointer"
                          onClick={() => setActiveArticle(article)}
                        >
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <button
                        onClick={() => setActiveArticle(article)}
                        className="text-xs font-bold text-black hover:text-demargo-orange flex items-center gap-1 transition"
                      >
                        <span>Read Story</span>
                        <span className="text-sm font-black text-demargo-orange">›</span>
                      </button>

                      <button
                        onClick={() => handleShareWhatsApp(article)}
                        className="text-xs text-slate-400 hover:text-demargo-orange transition flex items-center gap-1"
                        title="Share on WhatsApp"
                      >
                        <span>💬</span>
                        <span className="text-[10px] font-semibold">Share</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

      </div>

      {/* Full Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div 
            data-lenis-prevent="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto overscroll-contain p-3 sm:p-6 flex justify-center items-start cursor-pointer"
            onClick={() => setActiveArticle(null)}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white text-slate-900 w-full max-w-3xl my-4 sm:my-8 border border-slate-300 shadow-2xl relative cursor-default overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Top Reader Bar with always-accessible Close Button */}
              <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 text-xs text-demargo-orange font-bold uppercase tracking-wider truncate mr-4">
                  <span>●</span>
                  <span className="truncate">{activeArticle.category}</span>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="w-8 h-8 rounded-full bg-black hover:bg-slate-800 text-white flex items-center justify-center font-bold text-xs transition shadow-sm shrink-0"
                  aria-label="Close article"
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </div>

              {/* Modal Image Header */}
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-6 text-white space-y-1.5">
                  <span className="inline-block px-2.5 py-0.5 bg-demargo-orange text-black font-extrabold text-[10px] uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <span>{activeArticle.date}</span>
                    <span>•</span>
                    <span>{activeArticle.readTime}</span>
                    <span>•</span>
                    <span>By {activeArticle.author}</span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <h1 className="text-2xl sm:text-3xl font-black text-black leading-tight">
                  {activeArticle.title}
                </h1>

                {/* Secondary Highlight Trophy / Image if present */}
                {activeArticle.secondaryImage && (
                  <div className="bg-slate-100 p-4 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    <img 
                      src={activeArticle.secondaryImage} 
                      alt="Award Trophy / Plaque" 
                      className="h-28 w-auto object-contain shrink-0 shadow-xs" 
                    />
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="block text-black font-bold mb-1">Official Citation & Presentation:</strong>
                      {activeArticle.citationNote || activeArticle.summary}
                    </div>
                  </div>
                )}

                {/* Article Paragraphs */}
                <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                  {activeArticle.body.map((paragraph, idx) => (
                    <p key={idx} className={paragraph.startsWith('•') ? 'pl-4 font-medium text-slate-800' : ''}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags:</span>
                  {activeArticle.tags.map(t => (
                    <span key={t} className="text-xs font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 border border-slate-200">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Modal Footer CTA */}
                <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-black">Interested in this project or service?</h4>
                    <p className="text-xs text-slate-500">Contact our design desk directly with your inquiries.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setActiveArticle(null)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <span>← Back</span>
                    </button>
                    <button
                      onClick={() => handleShareWhatsApp(activeArticle)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-black hover:bg-slate-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <span>💬 Share</span>
                    </button>
                    <Link
                      to="/contact"
                      onClick={() => setActiveArticle(null)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-demargo-orange hover:opacity-90 text-black text-xs font-black transition flex items-center justify-center uppercase tracking-wider"
                    >
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

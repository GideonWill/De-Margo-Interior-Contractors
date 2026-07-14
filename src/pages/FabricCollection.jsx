import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet'

const FABRIC_FILENAMES = [
  "16910-14 100% BLACKOUT.jpeg",
  "16910-17 100% BLACKOUT.jpeg",
  "16910-24 100% BLACKOUT.jpeg",
  "16910-29 100% BLACKOUT.jpeg",
  "16910-3 100% BLACKOUT.jpeg",
  "2008-01.jpeg",
  "2008-04.jpeg",
  "2008-08.jpeg",
  "2008-10.jpeg",
  "2008-17.jpeg",
  "2008-18.jpeg",
  "2008-27.jpeg",
  "2008-30.jpeg",
  "2500-1.jpeg",
  "2500-14.jpeg",
  "2500-16.jpeg",
  "2500-2.jpeg",
  "2500-3.jpeg",
  "2500-4.jpeg",
  "2500-7.jpeg",
  "2600-1.jpeg",
  "2600-16.jpeg",
  "2600-4.jpeg",
  "2600-7.jpeg",
  "2700-11.jpeg",
  "2700-12.jpeg",
  "2700-2.jpeg",
  "2700-4.jpeg",
  "2700-5.jpeg",
  "2700-7.jpeg",
  "2800-10.jpeg",
  "2800-2.jpeg",
  "2800-3.jpeg",
  "2800-4.jpeg",
  "2800-9.jpeg",
  "33666-1.jpeg",
  "33666-11.jpeg",
  "33666-16.jpeg",
  "33666-20.jpeg",
  "33666-21.jpeg",
  "33666-3.jpeg",
  "33666-4.jpeg",
  "33666-9.jpeg",
  "8021-04 100% BLACKOUT.jpeg",
  "8021-05 100% BLACKOUT.jpeg",
  "8021-09 100% BLACKOUT.jpeg",
  "8021-15 100% BLACKOUT.jpeg",
  "8021-16 100% BLACKOUT.jpeg",
  "8021-24 100% BLACKOUT.jpeg",
  "8021-28 100% BLACKOUT.jpeg",
  "9628-ASH.jpeg",
  "9628-BLUE.jpeg",
  "9628-CREAM.jpeg",
  "985-02.jpeg",
  "985-04.jpeg",
  "985-07.jpeg",
  "985-11.jpeg",
  "A-01.jpeg",
  "A-07.jpeg",
  "A-16.jpeg",
  "AJ-01 ASH.jpeg",
  "AJ-03 BLUE.jpeg",
  "AJ-04 GREEN.jpeg",
  "AJ-05 PINK.jpeg",
  "AMR-12.jpeg",
  "AMR-15.jpeg",
  "AMR-17.jpeg",
  "AMR-2.jpeg",
  "AMR-5.jpeg",
  "CH-01.jpeg",
  "CH-02.jpeg",
  "CH-03.jpeg",
  "CH-04.jpeg",
  "CX-01 COFFE.jpeg",
  "CX-02 BLUE.jpeg",
  "CX-03 COFFE.jpeg",
  "CX-04 BLUE.jpeg",
  "HS06-C0FFE.jpeg",
  "HS06-CREAM.jpeg",
  "HS06-RED.jpeg",
  "HS07-BROWN.jpeg",
  "HS07-CREAM.jpeg",
  "MH216-11.jpeg",
  "MH216-12.jpeg",
  "MH216-4.jpeg",
  "MH216-5.jpeg",
  "MH6600-2.jpeg",
  "MH6600-4.jpeg",
  "MH6600-6.jpeg",
  "MH6600-7.jpeg",
  "MH6600-8.jpeg",
  "MH8021-1 BLACKOUT.jpeg",
  "MH8021-15 100% BLACKOUT.jpeg",
  "MH8021-2 100% BLACKOUT.jpeg",
  "MH8021-20.jpeg",
  "MH8021-24.jpeg",
  "MH8021-27 100% BLACKOUT.jpeg",
  "MH8021-28 100% BLACKOUT.jpeg",
  "MH8021-4 100% BLACKOUT.jpeg",
  "MH8021-7 100% BLACKOUT.jpeg",
  "MH8021-9 100% BLACKOUT.jpeg",
  "MHSF-1.jpeg",
  "MHSF-11.jpeg",
  "MHSF-12.jpeg",
  "MHSF-16.jpeg",
  "MHSF-2.jpeg",
  "MHSF-4.jpeg",
  "MILAN-11.jpeg",
  "Milan-10.jpeg",
  "Milan-7.jpeg",
  "Milan-9.jpeg",
  "RH01-ASH.jpeg",
  "RH01-BLUE.jpeg",
  "RH01-COFFE.jpeg",
  "RH540-ASH.jpeg",
  "RH540-BLUE.jpeg",
  "RH540-CREAM(DEEP).jpeg",
  "RH540-GOLD.jpeg",
  "RH540-WHITE.jpeg",
  "SP3300-10.jpeg",
  "SP3300-14.jpeg",
  "SP3300-16.jpeg",
  "SP3300-3.jpeg",
  "SP3300-4.jpeg",
  "SP3300-8.jpeg"
]

const BLINDS_FILENAMES = Array.from({ length: 34 }, (_, i) => `page_${String(i + 1).padStart(2, '0')}.jpg`)

const Seo = ({ title, description }) => (
  <Helmet>
    <title>{title} | Demargo Interior Contractors</title>
    <meta name="description" content={description} />
  </Helmet>
)

function FabricCollection() {
  const [activeTab, setActiveTab] = useState('fabrics') // 'fabrics' or 'blinds'
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [lightbox, setLightbox] = useState({ open: false, item: null })

  // Parse and cache the fabric data
  const fabrics = useMemo(() => {
    return FABRIC_FILENAMES.map(filename => {
      let code = filename.replace(/\.[^/.]+$/, "") // Strip file extension
      let category = "Other Series"
      let isBlackout = false

      if (/blackout/i.test(code)) {
        isBlackout = true
      }

      if (/^milan/i.test(code)) {
        category = "Milan Collection"
      } else if (/^16910/i.test(code)) {
        category = "16910 Blackout Series"
      } else if (/^8021/i.test(code)) {
        category = "8021 Premium Blackout"
      } else if (/^mh8021/i.test(code)) {
        category = "MH8021 Blackout Collection"
      } else {
        const prefixMatch = code.match(/^([a-z0-9]+)-/i)
        if (prefixMatch) {
          const prefix = prefixMatch[1].toUpperCase()
          category = `${prefix} Series`
        }
      }

      return {
        filename,
        code,
        category,
        isBlackout,
        src: `/assets/Fabrics/${encodeURIComponent(filename)}`
      }
    })
  }, [])

  // Parse and cache the blinds data
  const blinds = useMemo(() => {
    return BLINDS_FILENAMES.map((filename, i) => {
      const idx = i + 1
      const code = `BL-${String(idx).padStart(2, '0')}`
      return {
        filename,
        code,
        category: "Window Blinds",
        isBlackout: false,
        src: `/assets/Blinds/pages/${filename}`,
        thumb: `/assets/Blinds/thumbnails/${filename}`,
        index: idx
      }
    })
  }, [])

  // Extract unique categories for fabrics
  const categories = useMemo(() => {
    if (activeTab === 'blinds') return ['All']
    const cats = new Set(fabrics.map(item => item.category))
    return ['All', '100% Blackout', ...Array.from(cats).sort()]
  }, [activeTab, fabrics])

  // Filter items based on activeTab, category tab, and search query
  const filteredItems = useMemo(() => {
    const items = activeTab === 'fabrics' ? fabrics : blinds
    return items.filter(f => {
      let matchesCategory = false
      if (activeTab === 'blinds') {
        matchesCategory = true
      } else if (selectedCategory === 'All') {
        matchesCategory = true
      } else if (selectedCategory === '100% Blackout') {
        matchesCategory = f.isBlackout
      } else {
        matchesCategory = f.category === selectedCategory
      }

      const matchesSearch = f.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (activeTab === 'blinds' && `page ${f.index}`.includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [activeTab, fabrics, blinds, selectedCategory, searchQuery])

  // Group filtered items by their category to render headers (fabrics only)
  const groupedItems = useMemo(() => {
    if (activeTab === 'blinds') return {}
    const groups = {}
    filteredItems.forEach(f => {
      const catKey = selectedCategory === '100% Blackout' ? '100% Blackout Curtains' : f.category
      if (!groups[catKey]) {
        groups[catKey] = []
      }
      groups[catKey].push(f)
    })
    return groups
  }, [filteredItems, selectedCategory, activeTab])

  // Escape key to close lightbox
  useEffect(() => {
    if (!lightbox.open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightbox({ open: false, item: null })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox.open])

  const openLightbox = (item) => {
    setLightbox({ open: true, item })
  }

  const closeLightbox = () => {
    setLightbox({ open: false, item: null })
  }

  // Get WhatsApp message link
  const getWhatsAppLink = (item) => {
    if (!item) return ''
    if (activeTab === 'fabrics') {
      const text = encodeURIComponent(
        `Hello Demargo Interior Contractors, I'm interested in the fabric code "${item.code}" from your ${item.category}. Can I request a quote or order sample details?`
      )
      return `https://wa.me/233546478040?text=${text}`
    } else {
      const text = encodeURIComponent(
        `Hello Demargo Interior Contractors, I'm interested in the window blind design on Page ${item.index} of your Blinds Catalog. Can I request a quote or order details?`
      )
      return `https://wa.me/233546478040?text=${text}`
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16">
      <Seo 
        title={activeTab === 'fabrics' ? "Fabric Collection Catalog" : "Blinds Catalog Collection"} 
        description="Browse Demargo's extensive curated collection of premium drapery fabrics, sheers, and custom blinds." 
      />

      {/* Hero Header Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-[10px] uppercase tracking-widest text-demargo-orange shadow-sm font-bold">
          <span>●</span> {activeTab === 'fabrics' ? 'Premium Curtains & Sheers' : 'Custom Window Blinds'}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 uppercase tracking-tight">
          <span className="text-demargo-orange">Demargo</span> <span className="text-demargo-blue">Collections</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 text-xs md:text-sm leading-relaxed">
          {activeTab === 'fabrics' 
            ? "Browse our curated catalogs of curtain fabrics. Filter by category series or search by code, and click any item to enquire directly via WhatsApp." 
            : "Browse our window blinds catalog. Search by page number, click any page to zoom in, and enquire directly via WhatsApp."}
        </p>
      </section>

      {/* Tab Switcher */}
      <section className="max-w-6xl mx-auto px-4 flex justify-center gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab('fabrics')
            setSelectedCategory('All')
            setSearchQuery('')
          }}
          className={`flex-1 max-w-[220px] py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 border ${
            activeTab === 'fabrics'
              ? 'bg-demargo-orange border-demargo-orange text-white shadow-lg'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-demargo-orange shadow-sm'
          }`}
        >
          🏷️ Curtain Fabrics ({fabrics.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('blinds')
            setSelectedCategory('All')
            setSearchQuery('')
          }}
          className={`flex-1 max-w-[220px] py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 border ${
            activeTab === 'blinds'
              ? 'bg-demargo-blue border-demargo-blue text-white shadow-lg'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-demargo-blue shadow-sm'
          }`}
        >
          📐 Window Blinds ({blinds.length})
        </button>
      </section>

      {/* Main Filter Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-slate-200 p-4 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text"
                placeholder={activeTab === 'fabrics' ? "Search fabric code (e.g. Milan, 2008-17)..." : "Search blind page (e.g. Page 12, 5)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 focus:outline-none focus:border-demargo-orange transition bg-slate-50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Total Count */}
            <div className="text-[10px] uppercase font-bold text-slate-400 self-center tracking-wider">
              Showing {filteredItems.length} of {activeTab === 'fabrics' ? fabrics.length : blinds.length} {activeTab === 'fabrics' ? 'Fabrics' : 'Blinds'}
            </div>
          </div>

          {/* Categories Tab Bar (Curtain Fabrics only) */}
          {activeTab === 'fabrics' && (
            <div className="border-t border-slate-100 pt-4">
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap transition border ${
                      selectedCategory === cat 
                        ? 'bg-demargo-orange text-white border-demargo-orange' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-demargo-orange'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid of Items */}
      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-12">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 py-16 text-center shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-extrabold text-slate-800 text-sm uppercase">No {activeTab === 'fabrics' ? 'Fabrics' : 'Blinds'} Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query.</p>
          </div>
        ) : activeTab === 'blinds' ? (
          <div className="space-y-4">
            {/* Simple count header */}
            <div className="flex items-baseline justify-between border-b border-slate-200 pb-2">
              <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">Window Blinds</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{filteredItems.length} items</span>
            </div>

            {/* Continuous Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map(f => (
                <motion.div
                  key={f.code}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden relative cursor-zoom-in"
                >
                  {/* Image click-to-lightbox */}
                  <button 
                    onClick={() => openLightbox(f)}
                    className="relative w-full aspect-square overflow-hidden bg-slate-100 flex items-center justify-center"
                  >
                    <img 
                      src={f.thumb || f.src} 
                      alt={`Blinds page ${f.index}`} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-2.5 py-1 bg-white text-slate-900 text-[10px] font-bold uppercase shadow tracking-wider">
                        Quick View
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          Object.keys(groupedItems).sort().map(catName => (
            <div key={catName} className="space-y-4">
              {/* Group Header */}
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-2">
                <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">{catName}</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{groupedItems[catName].length} items</span>
              </div>

              {/* Group Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {groupedItems[catName].map(f => (
                  <motion.div
                    key={f.code}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Blackout Indicator Badge */}
                    {f.isBlackout && (
                      <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-black/80 text-white font-black text-[8px] uppercase tracking-wider">
                        100% Blackout
                      </span>
                    )}

                    {/* Image click-to-lightbox */}
                    <button 
                      onClick={() => openLightbox(f)}
                      className="relative w-full aspect-square overflow-hidden bg-slate-100 flex items-center justify-center cursor-zoom-in"
                    >
                      <img 
                        src={f.src} 
                        alt={`Sample code ${f.code}`} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-2.5 py-1 bg-white text-slate-900 text-[10px] font-bold uppercase shadow tracking-wider">
                          Quick View
                        </span>
                      </div>
                    </button>

                    {/* Footer Details */}
                    <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Code:</span>
                      <span className="font-extrabold text-slate-800 uppercase tracking-tight">{f.code}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox.open && lightbox.item && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-800 max-w-3xl w-full flex flex-col md:flex-row max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={closeLightbox}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/60 text-white hover:bg-black/80 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Large Image */}
              <div className="w-full md:w-1/2 aspect-square bg-slate-100 flex-shrink-0">
                <img 
                  src={lightbox.item.src} 
                  alt={`Curated sample ${lightbox.item.code}`} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Lightbox Info Panel */}
              <div className="w-full md:w-1/2 p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      {activeTab === 'fabrics' && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{lightbox.item.category}</span>
                      )}
                      {activeTab === 'fabrics' ? (
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{lightbox.item.code}</h3>
                      ) : (
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Window Blind - Page {lightbox.item.index}</h3>
                      )}
                    </div>
                    {activeTab === 'fabrics' && lightbox.item.isBlackout && (
                      <span className="px-2 py-0.5 bg-black text-white font-extrabold text-[9px] uppercase tracking-widest mt-1">
                        100% Blackout
                      </span>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {activeTab === 'fabrics' ? (
                        `Would you like to request samples of this fabric or get a free custom quote? Use the button below to message our designers directly on WhatsApp with this code.`
                      ) : (
                        `Would you like to request details or get a free custom quote for this window blind design? Use the button below to message our designers directly on WhatsApp.`
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <a
                    href={getWhatsAppLink(lightbox.item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm uppercase tracking-wider"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enquire on WhatsApp
                  </a>
                  
                  <button 
                    onClick={closeLightbox}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FabricCollection

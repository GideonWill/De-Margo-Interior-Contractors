import React, { useEffect } from 'react'

const Suspended = () => {
  useEffect(() => {
    document.title = 'Site not available'
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f9fafb] p-4 font-sans antialiased">
      <div className="w-full max-w-[460px] rounded-xl bg-white p-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] border border-gray-100">
        <h1 className="text-[28px] font-bold text-[#1a202c] mb-4 tracking-tight">
          Site not available
        </h1>
        
        <p className="text-[#4a5568] text-[16px] leading-[1.6] mb-8">
          This site was suspended as it reached the limits of the Free plan. It will be restored on the first day of the next month.
        </p>

        <div className="h-px bg-gray-100 w-full mb-8"></div>

        <p className="text-[#4a5568] text-[16px] leading-[1.6]">
          If this is your site, please visit Netlify’s{' '}
          <a 
            href="#" 
            className="text-[#00ad9f] hover:underline font-semibold"
            onClick={(e) => e.preventDefault()}
          >
            Billing FAQ page
          </a>{' '}
          or log into your Netlify account to upgrade your plan.
        </p>
      </div>
    </div>
  )
}

export default Suspended

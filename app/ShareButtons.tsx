'use client'

import { useState } from 'react'

// Always share the home page, so a shared link never carries survey state.
const SHARE_URL = 'https://pulse.womenshealth.world/'
const SHARE_TEXT = "Have your say on women's health in this short survey from Women's Health World."

const buttonClass =
  'w-11 h-11 rounded-full border border-gray-200 bg-white text-brand-purple flex items-center justify-center hover:border-brand-purple hover:bg-brand-light transition-all'

const links = [
  {
    name: 'Facebook',
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    name: 'Bluesky',
    href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
    path: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.479 0-.688-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z',
  },
  {
    name: 'LinkedIn',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
]

export default function ShareButtons({ className = '' }: { className?: string }) {
  const [message, setMessage] = useState('')

  // Instagram has no web share link. Phones get the system share sheet,
  // which lists Instagram; other devices copy the link to paste into the app.
  async function shareToInstagram() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice && navigator.share) {
      try {
        await navigator.share({ text: SHARE_TEXT, url: SHARE_URL })
      } catch {
        // The person closed the share sheet: nothing to do.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setMessage('Link copied. Paste it into your Instagram post or story.')
    } catch {
      setMessage(`Copy this link for Instagram: ${SHARE_URL}`)
    }
  }

  return (
    <div className={`text-center ${className}`}>
      <p className="text-sm font-semibold text-gray-700 mb-3">Share this survey</p>
      <div className="flex justify-center gap-3">
        {links.slice(0, 2).map((link) => (
          <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.name}`} title={`Share on ${link.name}`} className={buttonClass}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true"><path d={link.path} /></svg>
          </a>
        ))}
        <button type="button" onClick={shareToInstagram} aria-label="Share on Instagram" title="Share on Instagram" className={buttonClass}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="6" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </button>
        {links.slice(2).map((link) => (
          <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.name}`} title={`Share on ${link.name}`} className={buttonClass}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true"><path d={link.path} /></svg>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3 min-h-4" role="status">{message}</p>
    </div>
  )
}

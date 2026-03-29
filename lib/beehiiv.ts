// Beehiiv newsletter subscription helper
// Docs: https://developers.beehiiv.com/docs/v2

export async function subscribeToNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BEEHIIV_API_KEY
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID

  if (!apiKey || !publicationId) {
    console.error('Beehiiv env vars not set: BEEHIIV_API_KEY / BEEHIIV_PUBLICATION_ID')
    return { success: false, error: 'Newsletter service not configured' }
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,   // don't reactivate unsubscribers
          send_welcome_email: true,
          utm_source: 'insight-pulse',
          utm_medium: 'survey',
          utm_campaign: 'founding-participant',
        }),
      }
    )

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const msg = data?.errors?.[0]?.message || data?.message || `HTTP ${res.status}`
      console.error('Beehiiv error:', msg)
      return { success: false, error: msg }
    }

    return { success: true }
  } catch (err) {
    console.error('Beehiiv fetch error:', err)
    return { success: false, error: 'Network error' }
  }
}

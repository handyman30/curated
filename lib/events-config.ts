export const VENUES = [
  { name: 'Monolog', address: 'Plaza Senayan, Jakarta Selatan', time: '12:00', type: 'Coffee Morning' },
  { name: 'Tanamera Coffee', address: 'Jl. Wolter Monginsidi, Senopati', time: '10:30', type: 'Specialty Coffee' },
  { name: 'Common Grounds', address: 'Jl. Kemang Raya 72, Jakarta Selatan', time: '10:00', type: 'Brunch & Coffee' },
]

function nextSaturdays(count: number): Date[] {
  const result: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (result.length < count) {
    if (d.getDay() === 6) result.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return result
}

export function formatDay(d: Date) {
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function getUpcomingEvents() {
  const saturdays = nextSaturdays(3)
  return saturdays.map((sat, i) => {
    const venue = VENUES[i % VENUES.length]
    const [h, m] = venue.time.split(':').map(Number)
    const date = new Date(sat)
    date.setHours(h, m, 0, 0)
    return {
      id: `evt-${i}`,
      name: venue.name,
      address: venue.address,
      time: venue.time,
      type: venue.type,
      date,
      dateStr: formatDay(date),
      capacity: 3,
    }
  })
}

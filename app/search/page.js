import { api } from '../lib/api'
import VideoCard from '../components/VideoCard'
import Pagination from '../components/Pagination'

export const revalidate = 30

export async function generateMetadata({ searchParams }) {
  const q = searchParams?.q || ''
  const page = Number(searchParams?.page || 1)
  const title = q ? `Search: ${q}${page > 1 ? ` - Page ${page}` : ''}` : 'Search'
  const description = q ? `Search results for "${q}" on Hexmy.${page > 1 ? ` Page ${page}.` : ''}` : 'Search videos on Hexmy.'

  const canonicalBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://hexmy.com'
  const canonical = q
    ? `${canonicalBase}/search?q=${encodeURIComponent(q)}${page > 1 ? `&page=${page}` : ''}`
    : `${canonicalBase}/search`

  return {
    title,
    description,
    alternates: { canonical },
  }
}

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || ''
  const page = Number(searchParams?.page || 1)

  let data = { records: [], totalPages: 1, totalRecords: 0 }
  if (q) {
    data = await api.searchPosts(q, page, 16).catch(() => ({ records: [], totalPages: 1, totalRecords: 0 }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-6">Search</h1>

      <div className="mb-4 text-gray-300">
        {q ? (
          <>
            Showing results for <span className="text-white font-medium">"{q}"</span>
            {data.totalRecords ? ` — ${data.totalRecords} results` : ''}
          </>
        ) : (
          <span>Enter a keyword in the search bar to find videos.</span>
        )}
      </div>

      <div className="grid video-grid">
        {(data.records || []).map((v, idx) => (
          <VideoCard key={v._id || idx} video={v} />
        ))}
      </div>

      {q && (
        <Pagination basePath={`/search?q=${encodeURIComponent(q)}`} currentPage={page} totalPages={data.totalPages || 1} />
      )}
    </div>
  )
}

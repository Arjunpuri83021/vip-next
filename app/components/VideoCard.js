'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Clock, Eye, Heart, Star } from 'lucide-react'
import { api } from '../lib/api'

export default function VideoCard({ video, priority = false }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Format view count
  const formatViews = (views) => {
    if (!views) return '0'
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return '0:00'
    const mins = parseInt(minutes)
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60
    
    if (hours > 0) {
      return `${hours}:${remainingMins.toString().padStart(2, '0')}`
    }
    return `${mins}:00`
  }

  // Build URL segment: {id}-{title-slug}
  const slugify = (str = '') => String(str).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const getVideoUrlSegment = () => {
    const id = video._id || video.id || ''
    const title = video.titel || video.title || ''
    const s = slugify(title)
    return s ? `${id}-${s}` : id
  }

  // Get video title
  const getVideoTitle = () => {
    return video.titel || video.title || 'Untitled Video'
  }

  // Get pornstar names
  const getPornstarNames = () => {
    if (Array.isArray(video.name)) {
      return video.name.slice(0, 2) // Show max 2 names
    }
    return []
  }

  // Get tags
  const getTags = () => {
    if (Array.isArray(video.tags)) {
      return video.tags.slice(0, 3) // Show max 3 tags
    }
    return []
  }

  // Handle video click to update views
  const handleVideoClick = async () => {
    try {
      const videoId = video._id || video.id
      const currentViews = parseInt(video.views) || 0
      
      // Update views in background (don't wait for response)
      api.updateViews(videoId, currentViews).catch(error => {
        console.log('Failed to update views:', error)
      })
    } catch (error) {
      console.log('Error updating views:', error)
    }
  }

  return (
    <div className="video-card glass glass-border rounded-xl overflow-hidden group">
      <Link href={`/video/${getVideoUrlSegment()}`} onClick={handleVideoClick}>
        <div className="relative aspect-video bg-black/30">
          {/* Thumbnail Image */}
          {!imageError && video.imageUrl ? (
            <>
              <Image
                src={video.imageUrl}
                alt={getVideoTitle()}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                priority={priority}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-black/30 animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-purple-500/70 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </>
          ) : (
            // Fallback placeholder
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-500" />
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          {video.minutes && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-white text-[11px] flex items-center space-x-1">
              <Clock size={12} />
              <span>{formatDuration(video.minutes)}</span>
            </div>
          )}

          {/* Views Badge */}
          {video.views && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-white text-[11px] flex items-center space-x-1">
              <Eye size={12} />
              <span>{formatViews(video.views)}</span>
            </div>
          )}

          {/* Quality Badge */}
          <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] px-2 py-1 rounded font-semibold shadow">
            HD
          </div>
        </div>
      </Link>

      {/* Video Info */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link href={`/video/${getVideoUrlSegment()}`} onClick={handleVideoClick}>
          <h3 className="text-white/90 font-medium text-sm line-clamp-2 hover:text-white transition-colors duration-200">
            {getVideoTitle()}
          </h3>
        </Link>

        {/* Pornstars */}
        {getPornstarNames().length > 0 && (
          <div className="flex flex-wrap gap-1">
            {getPornstarNames().map((name, index) => (
              <Link
                key={index}
                href={`/pornstar/${name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs text-pink-300 hover:text-pink-200 transition-colors duration-200 flex items-center space-x-1"
              >
                <Star size={10} />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Tags */}
        {getTags().length > 0 && (
          <div className="flex flex-wrap gap-1">
            {getTags().map((tag, index) => (
              <Link
                key={index}
                href={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[11px] bg-white/5 hover:bg-purple-600/80 text-gray-300 hover:text-white px-2 py-1 rounded-full transition-colors duration-200 border border-white/10"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center space-x-3">
            {video.views && (
              <div className="flex items-center space-x-1">
                <Eye size={12} />
                <span>{formatViews(video.views)} views</span>
              </div>
            )}
            {video.createdAt && (
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {/* Like Button */}
          <button className="flex items-center space-x-1 hover:text-red-400 transition-colors duration-200">
            <Heart size={12} />
            <span>Like</span>
          </button>
        </div>
      </div>
    </div>
  )
}

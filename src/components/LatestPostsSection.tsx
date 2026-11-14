import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/charityData';
import { BlogPost } from '../types';
import { openNextSponsorLink } from '../services/adDonateService';
import { Calendar, Clock, ArrowRight, BookOpen, X, Heart, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LatestPostsSectionProps {
  onOpenDonate?: () => void;
}

export const LatestPostsSection: React.FC<LatestPostsSectionProps> = ({ onOpenDonate }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleFreeDonateClick = () => {
    openNextSponsorLink('latest-posts');
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <section id="posts" className="py-16 lg:py-24 bg-[#FAF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Field Dispatches &amp; Articles</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Latest News &amp; Project Updates
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            Follow our ongoing online fundraising milestones, humanitarian insights, and operational preparations for the upcoming flagship ground initiative by M R S.
          </p>
        </div>

        {/* Dedicated Space for Post Thumbnails and Text Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Dedicated Post Thumbnail Container */}
              <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-stone-100">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                {/* Category Badge overlay */}
                <span className="absolute top-4 left-4 bg-emerald-950/90 backdrop-blur-sm text-emerald-300 border border-emerald-700/60 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {post.category}
                </span>

                {/* Read Time overlay */}
                <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{post.readTime}</span>
                </span>
              </div>

              {/* Dedicated Content Space: Meta, Title & Text Snippet */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Meta Details */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{post.date}</span>
                    </span>
                    <span>&#183;</span>
                    <span>By {post.author}</span>
                  </div>

                  {/* Post Title */}
                  <h3
                    onClick={() => setSelectedPost(post)}
                    className="font-display font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
                  >
                    {post.title}
                  </h3>

                  {/* Dedicated Text Snippet Space */}
                  <div className="bg-stone-50/80 rounded-xl p-3.5 border border-stone-200/80">
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer group/btn"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleFreeDonateClick}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>Free Support Click</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Post Reader Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={() => setSelectedPost(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-5 sm:p-8 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close article modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Thumbnail */}
            <div className="rounded-2xl overflow-hidden h-64 sm:h-72 w-full mb-6 bg-stone-100">
              <img
                src={selectedPost.thumbnail}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Post Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                {selectedPost.category}
              </span>
              <span>&#183;</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedPost.date}</span>
              </span>
              <span>&#183;</span>
              <span>{selectedPost.readTime}</span>
              <span>&#183;</span>
              <span>By {selectedPost.author}</span>
            </div>

            {/* Modal Title */}
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mb-4 leading-tight">
              {selectedPost.title}
            </h3>

            {/* Text Snippet Highlight */}
            <div className="bg-emerald-50/70 border-l-4 border-emerald-600 p-4 rounded-r-xl mb-6">
              <p className="text-emerald-950 font-medium text-sm sm:text-base italic leading-relaxed">
                "{selectedPost.excerpt}"
              </p>
            </div>

            {/* Full Body Content */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed mb-8 space-y-4">
              <p>{selectedPost.content}</p>
              <p className="text-slate-600">
                Together through transparency, collective compassion, and community involvement, we can ensure that every child and family receives equitable pathways out of poverty.
              </p>
            </div>

            {/* Modal Action CTA */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleFreeDonateClick}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Support This Initiative (100% Free)</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              <button
                onClick={() => setSelectedPost(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-slate-700 hover:bg-stone-100 font-semibold text-sm cursor-pointer transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

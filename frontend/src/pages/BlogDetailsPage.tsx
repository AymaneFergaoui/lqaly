import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import { getPostBySlug } from '../services/blogService';
import { ChevronLeft, Clock, Calendar, User } from 'lucide-react';

const BlogDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || '');

  useSEO({
    title: post ? `${post.meta.title} — Lqaly Blog` : 'Article introuvable — Lqaly',
    description: post?.meta.description || 'Article non trouvé',
  });

  if (!post) {
    return (
      <div className="bg-[#FAF8F4] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full flex flex-col items-center justify-center text-center">
          <h1 className="font-fraunces text-4xl font-bold text-[#1C1B1A] mb-4">Article introuvable</h1>
          <Link to="/blog" className="bg-[#FC0903] text-white px-6 py-3 rounded-lg font-manrope font-bold hover:bg-[#C05621] transition-all">Retour au blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F4] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full pb-24">
        {/* Hero Section */}
        <div className="w-full h-[50vh] relative bg-[#1C1B1A]">
          <img 
            src={post.meta.coverImage} 
            alt={post.meta.title} 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/placeholder/1200/600'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end pb-16">
            <div className="max-w-[800px] mx-auto px-6 w-full">
              <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 font-manrope text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" /> Retour au blog
              </Link>
              <div className="mb-4">
                <span className="bg-[#FC0903] text-white px-3 py-1 rounded-full text-xs font-bold font-manrope">
                  {post.meta.category}
                </span>
              </div>
              <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {post.meta.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80 font-manrope text-sm">
                <div className="flex items-center gap-2"><User className="w-4 h-4" /> {post.meta.author}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.meta.date}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.meta.readTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[800px] mx-auto px-6 pt-16">
          <article className="prose prose-lg md:prose-xl prose-stone max-w-none font-manrope prose-headings:font-syne prose-headings:font-bold prose-h2:text-[#1C1B1A] prose-a:text-[#FC0903] prose-img:rounded-xl">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailsPage;

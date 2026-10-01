import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../services/blogService';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

const BlogPage: React.FC = () => {
  useSEO({
    title: 'Blog — Lqaly',
    description: 'Actualités, astuces immobilières et tendances du marché sur Lqaly.',
  });

  const posts = getAllPosts();

  return (
    <div className="bg-[#FAF8F4] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] mx-auto px-6 py-24 w-full">
        <div className="text-center mb-16">
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-[#1C1B1A] mb-4">Notre Blog</h1>
          <p className="text-[#5A5856] font-manrope text-lg max-w-2xl mx-auto">
            Découvrez nos derniers articles, analyses de marché et conseils pour investir dans l'immobilier de luxe.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#5A5856] font-manrope text-lg mb-8">De nouveaux articles seront bientôt publiés. Restez à l'écoute !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link to={`/blog/${post.meta.slug}`} key={post.meta.id} className="group flex flex-col bg-white rounded-2xl border border-[#E6D5C3] overflow-hidden hover:shadow-xl hover:border-[#FC0903]/30 transition-all duration-300">
                <div className="aspect-[16/10] overflow-hidden bg-[#F3F0EC] relative">
                  <img src={post.meta.coverImage} alt={post.meta.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/placeholder/800/500'; }} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#FC0903] font-manrope">
                    {post.meta.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-manrope text-[#9CA3AF] mb-3">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.meta.date}</div>
                    <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.meta.readTime}</div>
                  </div>
                  <h2 className="font-syne font-bold text-xl text-[#1C1B1A] mb-3 group-hover:text-[#FC0903] transition-colors line-clamp-2">
                    {post.meta.title}
                  </h2>
                  <p className="font-manrope text-[#5A5856] text-sm line-clamp-3 mb-6 flex-1">
                    {post.meta.description}
                  </p>
                  <div className="flex items-center gap-2 text-[#FC0903] font-manrope font-bold text-sm mt-auto">
                    Lire l'article <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;

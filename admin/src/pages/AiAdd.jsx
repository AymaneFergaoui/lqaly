import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import apiClient from '../services/apiClient';

const AiAdd = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResult(null);
    try {
      const response = await apiClient.post(
        `/api/products/add-ai`,
        { prompt }
      );

      if (response.data.success) {
        toast.success("Propriété créée avec succès via l'IA !");
        setResult(response.data.property);
        setPrompt('');
      } else {
        toast.error(response.data.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur de connexion avec le serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-fraunces text-gray-900 mb-2">Assistant IA Lqaly</h1>
        <p className="text-gray-500 font-manrope">Créez des annonces immobilières simplement en décrivant la propriété.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-manrope">
              Décrivez la propriété à créer :
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC0903]/20 focus:border-[#FC0903] transition-colors resize-none font-manrope"
              rows="5"
              placeholder="Exemple : Ajoute une villa de luxe à Marrakech. Elle dispose de 5 chambres, 4 salles de bains, fait 400m², et coûte 4 500 000 MAD. Elle possède une piscine et un jardin."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-[#111827] text-white px-6 py-3 rounded-xl font-manrope font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <span className="material-icons-round text-lg">auto_awesome</span>
                  Générer et Créer
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-[#FAF8F4] rounded-xl border border-gray-200"
          >
            <h3 className="font-fraunces font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-icons-round text-green-500">check_circle</span>
              Propriété ajoutée avec succès !
            </h3>
            
            <div className="grid grid-cols-2 gap-4 font-manrope text-sm">
              <div><span className="text-gray-500">Titre:</span> <span className="font-semibold">{result.title}</span></div>
              <div><span className="text-gray-500">Prix:</span> <span className="font-semibold">{result.price.toLocaleString('fr-MA')} MAD</span></div>
              <div><span className="text-gray-500">Localisation:</span> <span className="font-semibold">{result.location}</span></div>
              <div><span className="text-gray-500">Type:</span> <span className="font-semibold">{result.type}</span></div>
              <div><span className="text-gray-500">Chambres:</span> <span className="font-semibold">{result.beds}</span></div>
              <div><span className="text-gray-500">Salles de bain:</span> <span className="font-semibold">{result.baths}</span></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AiAdd;

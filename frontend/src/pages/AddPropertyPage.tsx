import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { userListingsAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// ── Constants ─────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = ['Appartement', 'Maison', 'Villa', 'Terrain', 'Penthouse', 'Studio', 'Bureau'];
const AVAILABILITY_OPTIONS = ['À Vendre', 'À Louer'];
const AMENITIES_LIST = [
  'Parking', 'Piscine', 'Salle de sport', 'Sécurité', 'Générateur électrique',
  'Ascenseur', 'Jardin', 'Clubhouse', 'Vidéosurveillance', 'Interphone',
  'Balcon', 'Résidence fermée', 'Aire de jeux',
  'Piste de course', 'Terrain de basket',
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  type: string;
  availability: string;
  location: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  description: string;
  phone: string;
  googleMapLink: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, token } = useAuth();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter une annonce.');
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const [form, setForm] = useState<FormState>({
    title: '',
    type: 'Appartement',
    availability: 'À Vendre',
    location: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    description: '',
    phone: '',
    googleMapLink: '',
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ──────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 4 - images.length;
    if (remaining <= 0) {
      toast.error('Maximum 4 images autorisées.');
      return;
    }
    const allowed = files.slice(0, remaining);
    const newImages = [...images, ...allowed];
    setImages(newImages);
    const newPreviews = allowed.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
    // Reset input so the same file can be re-selected after removal
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Veuillez télécharger au moins une image.');
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => fd.append(key, val));
    fd.append('amenities', JSON.stringify(amenities));
    images.forEach((img) => fd.append('images', img));

    setSubmitting(true);
    try {
      await userListingsAPI.create(fd);
      setSubmitted(true);
      toast.success('Annonce soumise ! Elle sera en ligne une fois approuvée par notre équipe.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Échec de la soumission de l\'annonce. Veuillez réessayer.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading / not-auth guard ───────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
        <div className="w-12 h-12 border-4 border-[#FC0903] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Success screen ─────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F4]">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-fraunces text-3xl font-bold text-[#221410] mb-3">Annonce Soumise !</h2>
          <p className="font-manrope text-[#6B7280] mb-8">
            Votre annonce est en cours de révision. Notre équipe l'approuvera dans les 24 à 48 heures.
            Vous recevrez un e-mail une fois qu'elle sera en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/my-listings"
              className="bg-[#FC0903] text-white font-manrope font-semibold px-6 py-3 rounded-lg hover:bg-[#B86851] transition-[background-color]"
            >
              Voir Mes Annonces
            </Link>
            <Link
              to="/properties"
              className="border border-[#FC0903] text-[#FC0903] font-manrope font-semibold px-6 py-3 rounded-lg hover:bg-[#FC0903] hover:text-white transition-[background-color,color]"
            >
              Parcourir les Propriétés
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-fraunces text-4xl font-bold text-[#221410] mb-2">
            Lister Votre Propriété
          </h1>
          <p className="font-manrope text-[#6B7280]">
            Remplissez les détails ci-dessous. Votre annonce sera examinée par notre équipe avant d'être mise en ligne.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Basic info ── */}
          <section className="bg-white border border-[#E6E0DA] rounded-2xl p-6 space-y-5">
            <h2 className="font-fraunces text-xl font-semibold text-[#221410]">Informations de Base</h2>

            <div>
              <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="ex. Spacieux Appartement 3 Pièces à Casablanca"
                className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                  Type de Propriété <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903] bg-white"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                  Type d'Annonce <span className="text-red-500">*</span>
                </label>
                <select
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903] bg-white"
                >
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                Adresse Complète / Emplacement <span className="text-red-500">*</span>
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="ex. 12, Rue de la Liberté, Casablanca, Maroc"
                className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903]"
              />
            </div>
          </section>

          {/* ── Price & specs ── */}
          <section className="bg-white border border-[#E6E0DA] rounded-2xl p-6 space-y-5">
            <h2 className="font-fraunces text-xl font-semibold text-[#221410]">Prix &amp; Détails</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                  Prix (MAD) <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="ex. 8500000"
                  className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903]"
                />
              </div>
              <div>
                <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                  Surface (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  name="sqft"
                  type="number"
                  value={form.sqft}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="ex. 120"
                  className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903]"
                />
              </div>
              <div>
                <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                  Chambres <span className="text-red-500">*</span>
                </label>
                <input
                  name="beds"
                  type="number"
                  value={form.beds}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="ex. 3"
                  className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903]"
                />
              </div>
              <div>
                <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                  Salles de Bain <span className="text-red-500">*</span>
                </label>
                <input
                  name="baths"
                  type="number"
                  value={form.baths}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 2"
                  className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903]"
                />
              </div>
            </div>
          </section>

          {/* ── Description & contact ── */}
          <section className="bg-white border border-[#E6E0DA] rounded-2xl p-6 space-y-5">
            <h2 className="font-fraunces text-xl font-semibold text-[#221410]">Description &amp; Contact</h2>

            <div>
              <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Décrivez la propriété — points forts, environs, caractéristiques uniques..."
                className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                  Téléphone de Contact <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+212 6 00 00 00 00"
                  className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903]"
                />
              </div>
              <div>
                <label className="block font-manrope text-sm font-medium text-[#374151] mb-1">
                  Lien Google Maps <span className="text-[#6B7280] font-normal">(optionnel)</span>
                </label>
                <input
                  name="googleMapLink"
                  value={form.googleMapLink}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full border border-[#E6E0DA] rounded-lg px-4 py-2.5 font-manrope text-sm text-[#221410] focus:outline-none focus:ring-2 focus:ring-[#FC0903]/40 focus:border-[#FC0903]"
                />
              </div>
            </div>
          </section>

          {/* ── Amenities ── */}
          <section className="bg-white border border-[#E6E0DA] rounded-2xl p-6">
            <h2 className="font-fraunces text-xl font-semibold text-[#221410] mb-4">Commodités</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES_LIST.map((amenity) => {
                const checked = amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-[background-color,border-color] select-none ${
                      checked
                        ? 'border-[#FC0903] bg-[#FC0903]/5 text-[#FC0903]'
                        : 'border-[#E6E0DA] text-[#374151] hover:border-[#FC0903]/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    <span
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                        checked ? 'bg-[#FC0903] border-[#FC0903]' : 'border-[#D4CEC8]'
                      }`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="font-manrope text-sm">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* ── Images ── */}
          <section className="bg-white border border-[#E6E0DA] rounded-2xl p-6">
            <h2 className="font-fraunces text-xl font-semibold text-[#221410] mb-1">
              Images <span className="text-red-500">*</span>
            </h2>
            <p className="font-manrope text-sm text-[#6B7280] mb-4">
              Téléchargez jusqu'à 4 images (JPG, PNG, WebP). La première image sera la couverture.
            </p>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square border border-[#E6E0DA]">
                    <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#FC0903] text-white font-manrope text-xs px-2 py-0.5 rounded">
                        Couverture
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {images.length < 4 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border-2 border-dashed border-[#FC0903]/40 rounded-lg px-6 py-4 text-[#FC0903] font-manrope text-sm hover:border-[#FC0903] hover:bg-[#FC0903]/5 transition-[border-color,background-color]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter des Photos ({images.length}/4)
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleImageChange}
            />
          </section>

          {/* ── Approval notice ── */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-manrope text-sm text-amber-800">
              Votre annonce sera examinée par notre équipe avant d'apparaître publiquement. Cela permet de garder
              la plateforme sûre et digne de confiance pour tous. Vous serez averti par e-mail une fois
              qu'elle sera approuvée.
            </p>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#FC0903] text-white font-manrope font-semibold text-base py-3.5 rounded-xl hover:bg-[#B86851] transition-[background-color] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Soumission en cours…
              </span>
            ) : (
              'Soumettre pour Révision'
            )}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddPropertyPage;

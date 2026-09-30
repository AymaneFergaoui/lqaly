import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AuthHeader from '../components/auth/AuthHeader';
import { userAPI } from '../services/api';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez entrer votre adresse e-mail');
      return;
    }

    setLoading(true);
    try {
      const { data } = await userAPI.forgotPassword(email);
      if (data.success) {
        setIsSuccess(true);
        toast.success('Lien de réinitialisation envoyé à votre e-mail !');
      } else {
        toast.error(data.message || 'Échec de l\'envoi du lien de réinitialisation');
      }
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast.error(error.response?.data?.message || 'Échec de l\'envoi du lien de réinitialisation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center py-12 px-4">
      <div className="max-w-[480px] w-full">
        {/* Logo */}
        <AuthHeader />

        {/* Card */}
        <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-xl">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-syne font-bold text-2xl text-[#221410] mb-3">
                Vérifiez Votre E-mail
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#4B5563] mb-6 leading-relaxed">
                Nous avons envoyé un lien de réinitialisation de mot de passe à{' '}
                <span className="font-semibold text-[#221410]">{email}</span>.
                <br />
                Veuillez vérifier votre boîte de réception et suivre les instructions.
              </p>
              <p className="font-manrope font-extralight text-xs text-[#9CA3AF] mb-8">
                Vous n'avez pas reçu l'e-mail ? Vérifiez vos spams ou réessayez.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="w-full bg-transparent border border-[#FC0903] text-[#FC0903] font-manrope font-bold py-3 rounded-xl hover:bg-[#FC0903] hover:text-white transition-all"
                >
                  Essayer un Autre E-mail
                </button>
                <Link
                  to="/signin"
                  className="w-full bg-[#FC0903] text-white font-manrope font-bold py-3 rounded-xl hover:bg-[#C05621] transition-all text-center"
                >
                  Retour à la Connexion
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-[#FFF7ED] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-7 h-7 text-[#FC0903]" />
                </div>
                <h1 className="font-syne font-bold text-3xl text-[#221410] mb-2">
                  Mot de Passe Oublié ?
                </h1>
                <p className="font-manrope font-extralight text-sm text-[#4B5563]">
                  Pas d'inquiétude ! Entrez votre e-mail et nous vous enverrons un lien de réinitialisation.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block font-manrope font-medium text-sm text-[#374151] mb-2">
                    Adresse E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="w-full bg-[#F5F1E8] border border-[#EBE5DE] rounded-xl pl-12 pr-4 py-3.5 font-manrope text-sm text-[#221410] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FC0903] focus:ring-1 focus:ring-[#FC0903] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FC0903] hover:bg-[#C05621] disabled:opacity-60 disabled:cursor-not-allowed text-white font-manrope font-bold text-base py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    'Envoyer le Lien de Réinitialisation'
                  )}
                </button>
              </form>

              {/* Back to Sign In */}
              <Link
                to="/signin"
                className="flex items-center justify-center gap-2 mt-6 font-manrope font-medium text-sm text-[#64748B] hover:text-[#FC0903] transition-[color]"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la Connexion
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

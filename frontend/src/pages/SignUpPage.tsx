import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import AuthHeader from '../components/auth/AuthHeader';
import SignUpForm from '../components/auth/SignUpForm';
import { useAuth } from '../contexts/AuthContext';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  const handleSignUp = async (formData: any) => {
    try {
      setError(null);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const result = await register(fullName, formData.email, '', formData.password);
      if (result?.requiresVerification) {
        setVerificationEmail(formData.email);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Échec de l\'inscription. Veuillez réessayer.');
    }
  };

  if (verificationEmail) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center py-12 px-4">
        <div className="max-w-[520px] w-full">
          <AuthHeader />
          <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-[#FFF7ED] rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-[#FC0903]" />
            </div>
            <h1 className="font-syne font-bold text-2xl text-[#221410] mb-3">
              Vérifiez Votre E-mail
            </h1>
            <p className="font-manrope font-extralight text-sm text-[#4B5563] mb-2">
              Nous avons envoyé un lien de vérification à
            </p>
            <p className="font-manrope font-semibold text-[#FC0903] mb-4">{verificationEmail}</p>
            <p className="font-manrope font-extralight text-sm text-[#6B7280] mb-6">
              Cliquez sur le lien dans l'e-mail pour activer votre compte. Le lien expire dans 24 heures.
            </p>
            <Link
              to="/signin"
              className="w-full inline-block bg-[#FC0903] text-white font-manrope font-bold py-3 rounded-xl hover:bg-[#C05621] transition-[background-color] text-center"
            >
              Aller à la Connexion
            </Link>
          </div>
          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-manrope font-medium text-sm text-[#64748B] hover:text-[#FC0903] transition-[color]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'Accueil</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center py-12 px-4">
      <div className="max-w-[520px] w-full">
        {/* Logo */}
        <AuthHeader />

        {/* Sign Up Card */}
        <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-syne font-bold text-3xl text-[#221410] mb-2">
              Créer un Compte
            </h1>
            <p className="font-manrope font-extralight text-sm text-[#4B5563]">
              Rejoignez Lqaly et trouvez la maison de vos rêves
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="font-manrope text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <SignUpForm onSubmit={handleSignUp} />

          {/* Sign In Link */}
          <p className="text-center font-manrope font-extralight text-sm text-[#64748B]">
            Vous avez déjà un compte ?{' '}
            <Link
              to="/signin"
              className="font-semibold text-[#FC0903] hover:text-[#C05621] transition-[color]"
            >
              Se Connecter
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-manrope font-medium text-sm text-[#64748B] hover:text-[#FC0903] transition-[color]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'Accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
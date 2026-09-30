import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import AuthHeader from '../components/auth/AuthHeader';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type VerificationStatus = 'loading' | 'success' | 'error';

const VerifyEmailPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Lien de vérification invalide. Aucun jeton fourni.');
        return;
      }

      try {
        const { data } = await userAPI.verifyEmail(token);
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Votre e-mail a été vérifié avec succès !');
          // If backend returned a token, log the user in automatically
          if (data.token && data.user) {
            localStorage.setItem('lqaly_token', data.token);
            localStorage.setItem('lqaly_user', JSON.stringify(data.user));
            updateUser(data.user);
            setTimeout(() => navigate('/'), 3000);
          } else {
            setTimeout(() => navigate('/signin'), 4000);
          }
        } else {
          setStatus('error');
          setMessage(data.message || 'Échec de la vérification. Veuillez réessayer.');
        }
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message ||
          'Échec de la vérification. Le lien a peut-être expiré ou est invalide.'
        );
      }
    };

    verifyEmail();
  }, [token, navigate, updateUser]);

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center py-12 px-4">
      <div className="max-w-[480px] w-full">
        {/* Logo */}
        <AuthHeader />

        {/* Card */}
        <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-xl">
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#FFF7ED] rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-8 h-8 text-[#FC0903] animate-spin" />
              </div>
              <h1 className="font-syne font-bold text-2xl text-[#221410] mb-3">
                Vérification de Votre E-mail
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#4B5563]">
                Veuillez patienter pendant que nous vérifions votre adresse e-mail...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-syne font-bold text-2xl text-[#221410] mb-3">
                E-mail Vérifié !
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#4B5563] mb-6">
                {message}
              </p>
              <p className="font-manrope text-xs text-[#9CA3AF] mb-6">
                Redirection en cours...
              </p>
              <Link
                to="/signin"
                className="w-full inline-block bg-[#FC0903] text-white font-manrope font-bold py-3 rounded-xl hover:bg-[#C05621] transition-all text-center"
              >
                Se Connecter Maintenant
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="font-syne font-bold text-2xl text-[#221410] mb-3">
                Échec de la Vérification
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#4B5563] mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  to="/signin"
                  className="w-full inline-block bg-[#FC0903] text-white font-manrope font-bold py-3 rounded-xl hover:bg-[#C05621] transition-all text-center"
                >
                  Essayez de vous Connecter
                </Link>
                <p className="font-manrope text-xs text-[#6B7280]">
                  Si votre lien a expiré, la connexion enverra un nouvel e-mail de vérification.
                </p>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 font-manrope font-medium text-sm text-[#64748B] hover:text-[#FC0903] transition-[color]"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'Accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

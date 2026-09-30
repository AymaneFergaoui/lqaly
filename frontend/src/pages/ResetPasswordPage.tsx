import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import AuthHeader from '../components/auth/AuthHeader';
import { userAPI } from '../services/api';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/\d/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Faible';
    if (passwordStrength === 2) return 'Moyen';
    if (passwordStrength === 3) return 'Bon';
    return 'Fort';
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isFormValid = password && confirmPassword && passwordsMatch && passwordStrength >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Veuillez vous assurer que les mots de passe correspondent et répondent aux exigences de sécurité.');
      return;
    }

    if (!token) {
      toast.error('Lien de réinitialisation invalide. Veuillez en demander un nouveau.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await userAPI.resetPassword(token, password);
      if (data.success) {
        setIsSuccess(true);
        toast.success('Réinitialisation du mot de passe réussie !');
        setTimeout(() => navigate('/signin'), 3000);
      } else {
        toast.error(data.message || 'Échec de la réinitialisation du mot de passe');
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Échec de la réinitialisation du mot de passe. Le lien a peut-être expiré.');
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
                Mot de Passe Réinitialisé !
              </h1>
              <p className="font-manrope font-extralight text-sm text-[#4B5563] mb-6">
                Votre mot de passe a été réinitialisé avec succès. Redirection vers la connexion...
              </p>
              <Link
                to="/signin"
                className="w-full inline-block bg-[#FC0903] text-white font-manrope font-bold py-3 rounded-xl hover:bg-[#C05621] transition-all text-center"
              >
                Se Connecter Maintenant
              </Link>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-[#FFF7ED] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Lock className="w-7 h-7 text-[#FC0903]" />
                </div>
                <h1 className="font-syne font-bold text-3xl text-[#221410] mb-2">
                  Réinitialiser le Mot de Passe
                </h1>
                <p className="font-manrope font-extralight text-sm text-[#4B5563]">
                  Créez un nouveau mot de passe sécurisé pour votre compte.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block font-manrope font-medium text-sm text-[#374151] mb-2">
                    Nouveau Mot de Passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Entrez le nouveau mot de passe"
                      className="w-full bg-[#F5F1E8] border border-[#EBE5DE] rounded-xl pl-12 pr-12 py-3.5 font-manrope text-sm text-[#221410] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FC0903] focus:ring-1 focus:ring-[#FC0903] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#FC0903] transition-[color]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1.5">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-[background-color] ${
                              level <= passwordStrength ? getStrengthColor() : 'bg-[#E6E0DA]'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="font-manrope text-xs text-[#6B7280]">
                        Force du mot de passe : <span className="font-medium">{getStrengthLabel()}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block font-manrope font-medium text-sm text-[#374151] mb-2">
                    Confirmer le Mot de Passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmez le nouveau mot de passe"
                      className="w-full bg-[#F5F1E8] border border-[#EBE5DE] rounded-xl pl-12 pr-12 py-3.5 font-manrope text-sm text-[#221410] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FC0903] focus:ring-1 focus:ring-[#FC0903] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#FC0903] transition-[color]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Match Indicator */}
                  {confirmPassword && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {passwordsMatch ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-manrope text-xs text-green-600">Les mots de passe correspondent</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="font-manrope text-xs text-red-600">Les mots de passe ne correspondent pas</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Requirements */}
                <div className="bg-[#F5F1E8] rounded-xl p-4">
                  <p className="font-manrope font-medium text-xs text-[#374151] mb-2">Exigences du Mot de Passe :</p>
                  <ul className="space-y-1">
                    {[
                      { text: 'Au moins 8 caractères', met: password.length >= 8 },
                      { text: 'Une lettre majuscule', met: /[A-Z]/.test(password) },
                      { text: 'Une lettre minuscule', met: /[a-z]/.test(password) },
                      { text: 'Un chiffre', met: /\d/.test(password) },
                      { text: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(password) },
                    ].map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 ${req.met ? 'text-green-500' : 'text-[#D1D5DB]'}`} />
                        <span className={`font-manrope text-xs ${req.met ? 'text-green-600' : 'text-[#9CA3AF]'}`}>
                          {req.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="w-full bg-[#FC0903] hover:bg-[#C05621] disabled:opacity-60 disabled:cursor-not-allowed text-white font-manrope font-bold text-base py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Réinitialisation...
                    </>
                  ) : (
                    'Réinitialiser le Mot de Passe'
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

export default ResetPasswordPage;

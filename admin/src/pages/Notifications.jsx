import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, Info, Clock, Check } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'alert',
    title: 'Nouvelle propriété en attente',
    message: 'Une nouvelle villa à Marrakech nécessite votre approbation.',
    time: 'Il y a 5 min',
    isRead: false,
    icon: AlertCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    id: 2,
    type: 'success',
    title: 'Propriété approuvée',
    message: 'Appartement au centre-ville de Rabat a été publié avec succès.',
    time: 'Il y a 2 heures',
    isRead: false,
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    id: 3,
    type: 'info',
    title: 'Nouveau message utilisateur',
    message: 'Un utilisateur a envoyé un message concernant "Villa sur l\'Océan".',
    time: 'Il y a 1 jour',
    isRead: false,
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 4,
    type: 'system',
    title: 'Mise à jour du système',
    message: 'Le système a été mis à jour avec de nouvelles fonctionnalités d\'IA.',
    time: 'Il y a 2 jours',
    isRead: true,
    icon: Bell,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10'
  }
];

const Notifications = () => {
  return (
    <div className="min-h-screen p-8 bg-[#FAF8F4]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-[#1C1B1A]">Notifications</h1>
            <p className="text-[#5A5856] mt-1">Gérez vos alertes et mises à jour récentes</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E6D5C3] text-[#1C1B1A] rounded-xl hover:bg-[#FC0903] hover:text-white hover:border-[#FC0903] transition-all text-sm font-medium shadow-sm"
          >
            <Check className="w-4 h-4" />
            Tout marquer comme lu
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E6D5C3] shadow-card overflow-hidden"
        >
          {mockNotifications.length > 0 ? (
            <div className="divide-y divide-[#E6D5C3]">
              {mockNotifications.map((notification, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={notification.id}
                  className={`p-6 hover:bg-[#FAF8F4] transition-colors cursor-pointer flex gap-4 ${
                    !notification.isRead ? 'bg-[#FC0903]/[0.02]' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notification.bgColor}`}>
                    <notification.icon className={`w-6 h-6 ${notification.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold text-[#1C1B1A] ${!notification.isRead ? 'font-bold' : ''}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] shrink-0 ml-4">
                        <Clock className="w-3.5 h-3.5" />
                        {notification.time}
                      </div>
                    </div>
                    <p className="text-[#5A5856] text-sm leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  
                  {!notification.isRead && (
                    <div className="flex items-center justify-center shrink-0 w-3">
                      <div className="w-2.5 h-2.5 bg-[#FC0903] rounded-full" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FAF8F4] rounded-2xl flex items-center justify-center mb-4 border border-[#E6D5C3]">
                <Bell className="w-8 h-8 text-[#9CA3AF]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1B1A] mb-1">Aucune notification</h3>
              <p className="text-[#5A5856]">Vous êtes à jour, il n'y a pas de nouvelles alertes.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;

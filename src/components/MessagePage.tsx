import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  getCurrentUser, 
  getPhotoUrl, 
  UserRole
} from '../services/authService';
import { 
  sendMessage, 
  getMessages, 
  hasExistingConversation,
  updateMessage,
  deleteMessage,
  markAllAsRead,
  Message as MessageType,
  Partner
} from '../services/messageService';
// Import du service de configuration
import { backendUrl, getAuthHeaders } from '../services/configService';
// Import du composant ConversationArea
import ConversationArea from './ConversationArea';

// Interface pour le destinataire du message
type Recipient = Partner;

// Interface pour le message en cours de modification
interface EditingMessage {
  id: number;
  content: string;
}

// Interface pour le message sélectionné
interface SelectedMessage {
  id: number;
  position: { x: number, y: number };
}

// Extension de l'interface Message pour inclure l'état de suppression
interface ExtendedMessage extends MessageType {
  isDeleting?: boolean;
}

const MessagePage: React.FC = () => {
  const { userId } = useParams(); // Récupère l'ID de l'utilisateur depuis l'URL
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [hasConversation, setHasConversation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [editingMessage, setEditingMessage] = useState<EditingMessage | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<SelectedMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Vérifier si l'utilisateur est connecté
  const isUserLoggedIn = !!currentUser;

  // Fermer le menu contextuel au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedMessage && !(event.target as Element).closest('.message-options-menu') && 
          !(event.target as Element).closest('.message-options-button')) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedMessage]);

  // Fonction pour récupérer les informations du profil utilisateur
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log(`🔄 [PROFILE] Récupération du profil de l'utilisateur ID ${userId}`);
      
      // Utiliser le bon endpoint API
      const response = await fetch(`${backendUrl}/users/${userId}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La réponse n'est pas au format JSON");
      }
      
      const data = await response.json();
      console.log(`✅ [PROFILE] Profil utilisateur récupéré:`, data);
      return data.data || data;
      
    } catch (error) {
      console.warn("⚠️ [PROFILE] Impossible de récupérer le profil via l'API:", error);
      
      // Fallback : utiliser des données mockées temporairement
      console.log(`🔄 [PROFILE] Utilisation de données mockées pour l'utilisateur ID ${userId}`);
      const user = getCurrentUser();
      
      // Si l'utilisateur actuel a le même ID, utilisez ses données
      if (user && user.id.toString() === userId) {
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.email?.split('@')[0] || user.firstName,
          profilePhoto: user.photo,
          role: user.role || 'Utilisateur',
          shopName: user.role === UserRole.MERCHANT ? "Ma Boutique" : undefined
        };
      }
      
      // Sinon, utiliser des données par défaut
      return {
        id: parseInt(userId),
        firstName: "Utilisateur",
        lastName: userId,
        username: `user${userId}`,
        profilePhoto: null,
        role: "Membre",
        shopName: "Boutique"
      };
    }
  };

  // Vérifier si un message peut être modifié (uniquement si c'est un message texte de l'utilisateur actuel)
  const canModifyMessage = (msg: MessageType) => {
    return msg.senderId === currentUser?.id && !!msg.content && !msg.mediaUrl;
  };
  
  // Effet pour charger les informations du destinataire et les messages existants
  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !isUserLoggedIn) {
        if (!isUserLoggedIn) return; // Si l'utilisateur n'est pas connecté, ne rien faire
        navigate('/');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let existingConversation = false;
        
        try {
          // Vérifier si une conversation existe déjà
          console.log(`🔄 [MESSAGE] Vérification de l'existence d'une conversation avec l'utilisateur ID ${userId}`);
          existingConversation = await hasExistingConversation(parseInt(userId));
          setHasConversation(existingConversation);
          console.log(`✅ [MESSAGE] Conversation existante: ${existingConversation}`);
        } catch (convError) {
          console.warn("⚠️ [MESSAGE] Erreur lors de la vérification des conversations:", convError);
          // Continuer même en cas d'erreur
        }

        if (existingConversation) {
          try {
            // Récupérer les messages existants
            console.log(`🔄 [MESSAGE] Récupération des messages avec l'utilisateur ID ${userId}`);
            const response = await getMessages(parseInt(userId));
            setRecipient(response.data.partner);
            setMessages(response.data.messages);
            console.log(`✅ [MESSAGE] ${response.data.messages.length} message(s) récupéré(s)`);
            
            // Marquer tous les messages comme lus
            try {
              await markAllAsRead(parseInt(userId));
            } catch (readError) {
              console.warn("⚠️ [MESSAGE] Erreur lors du marquage des messages comme lus:", readError);
            }
          } catch (msgError) {
            console.error("❌ [MESSAGE] Erreur lors de la récupération des messages:", msgError);
            throw msgError;
          }
        } else {
          // En l'absence de conversation, récupérer les informations de l'utilisateur depuis l'API
          try {
            console.log(`🔄 [MESSAGE] Récupération des informations de l'utilisateur ID ${userId}`);
            const userProfile = await fetchUserProfile(userId);
            
            setRecipient({
              id: parseInt(userId),
              firstName: userProfile.firstName || "Utilisateur",
              lastName: userProfile.lastName || userId,
              username: userProfile.username || `user${userId}`,
              photo: userProfile.profilePhoto || null,
              partnerName: userProfile.shopName || "Boutique", 
              partnerRole: userProfile.role || "Membre"
            });
            console.log(`✅ [MESSAGE] Informations utilisateur récupérées`);
          } catch (profileError) {
            console.error("❌ [MESSAGE] Erreur lors de la récupération du profil:", profileError);
            
            // Fallback avec des données mockées en cas d'erreur
            console.log(`🔄 [MESSAGE] Utilisation de données mockées pour l'utilisateur ID ${userId}`);
            setRecipient({
              id: parseInt(userId),
              firstName: "Utilisateur",
              lastName: userId,
              username: `user${userId}`,
              photo: null,
              partnerName: "Boutique", 
              partnerRole: "Membre"
            });
          }
        }
      } catch (error) {
        console.error('❌ [MESSAGE] Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate, isUserLoggedIn]);

  // Fonction de rafraîchissement des messages
  const refreshMessages = async () => {
    if (!userId) return;
    
    try {
      const response = await getMessages(parseInt(userId));
      setMessages(response.data.messages);
    } catch (error) {
      console.error('❌ [MESSAGE] Erreur lors du rafraîchissement des messages:', error);
    }
  };

  // Redirection vers la page de connexion
  const redirectToLogin = () => {
    navigate('/login', { state: { returnUrl: window.location.pathname } });
  };

  // Redirection vers la page précédente
  const goBack = () => {
    navigate(-1);
  };

  // Fonction pour ouvrir le sélecteur de fichier
  const handleOpenFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Gérer la sélection d'un média
  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Vérifier la taille du fichier (limite à 10 Mo)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale: 10 Mo.');
        return;
      }
      
      // Vérifier le type du fichier
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setError('Seules les images et les vidéos sont acceptées.');
        return;
      }
      
      setMediaFile(file);
      setShowMediaPreview(true);
      setError(null);
    }
  };

  // Supprimer le média sélectionné
  const handleRemoveMedia = () => {
    setMediaFile(null);
    setShowMediaPreview(false);
  };

  // Gérer le clic sur le bouton du menu d'options
  const handleMessageClick = (event: React.MouseEvent, msgId: number) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Si c'est le même message, fermer le menu
    if (selectedMessage?.id === msgId) {
      setSelectedMessage(null);
    } else {
      // Calculer la position du menu contextuel
      const messageElement = (event.currentTarget as HTMLElement).closest('.message-container');
      const rect = messageElement ? messageElement.getBoundingClientRect() : { left: 0, top: 0 };
      
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      
      // Ouvrir le menu pour ce message
      setSelectedMessage({ id: msgId, position });
      // Fermer le mode édition si actif
      setEditingMessage(null);
    }
  };

  // Activer le mode édition
  const handleEditMessage = (msgId: number, content: string) => {
    setEditingMessage({ id: msgId, content });
    setSelectedMessage(null); // Fermer le menu contextuel
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  // Sauvegarder l'édition avec appel au service
  const handleSaveEdit = async () => {
    if (!editingMessage) return;
    
    try {
      console.log(`🔄 [MESSAGE] Mise à jour du message ID ${editingMessage.id}`);
      
      // Vérifier si le contenu est vide
      if (!editingMessage.content.trim()) {
        setError('Le message ne peut pas être vide');
        return;
      }
      
      setError(null);
      
      try {
        // Appeler le service pour mettre à jour le message
        const response = await updateMessage(editingMessage.id, editingMessage.content);
        
        if (response && response.success) {
          // Mise à jour réussie, mettre à jour l'état local
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === editingMessage.id 
                ? { ...msg, content: editingMessage.content, updatedAt: new Date().toISOString() } 
                : msg
            )
          );
          console.log(`✅ [MESSAGE] Message mis à jour avec succès`);
        } else {
          // Message de réussite du backend mais réponse incomplète
          console.warn('⚠️ [MESSAGE] Réponse incomplète lors de la mise à jour');
          // Mettre quand même à jour l'interface
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === editingMessage.id 
                ? { ...msg, content: editingMessage.content, updatedAt: new Date().toISOString() } 
                : msg
            )
          );
        }
      } catch (apiError) {
        console.warn('⚠️ [MESSAGE] Erreur lors de la mise à jour du message:', apiError);
        setError('Erreur lors de la mise à jour du message. Les modifications sont enregistrées localement.');
        
        // Simuler une mise à jour côté client en cas d'erreur API
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === editingMessage.id 
              ? { ...msg, content: editingMessage.content, updatedAt: new Date().toISOString() } 
              : msg
          )
        );
      }
      
      // Fermer le mode édition
      setEditingMessage(null);
      
    } catch (error: any) {
      console.error('❌ [MESSAGE] Erreur lors de la mise à jour du message:', error);
      setError(error.message || 'Erreur lors de la mise à jour du message');
    }
  };

  // Supprimer le message avec appel au service
  const handleDeleteMessage = async (msgId: number, forEveryone: boolean) => {
    try {
      console.log(`🔄 [MESSAGE] Suppression du message ID ${msgId}, pour tous: ${forEveryone}`);
      
      setError(null);
      
      // Montrer une indication visuelle que la suppression est en cours
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === msgId 
            ? { ...msg, isDeleting: true } 
            : msg
        )
      );
      
      try {
        // Appeler le service pour supprimer le message
        const response = await deleteMessage(msgId, forEveryone);
        
        if (response && response.success) {
          // Suppression réussie, mettre à jour l'état local
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
          console.log(`✅ [MESSAGE] Message supprimé avec succès`);
        } else {
          // Message de réussite du backend mais réponse incomplète
          console.warn('⚠️ [MESSAGE] Réponse incomplète lors de la suppression');
          // Supprimer quand même de l'interface
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
        }
      } catch (apiError: any) {
        console.warn('⚠️ [MESSAGE] Erreur lors de la suppression du message:', apiError);
        
        // Afficher un message d'erreur approprié
        if (apiError.status === 403) {
          setError("Vous n'avez pas l'autorisation de supprimer ce message.");
          
          // Enlever l'indication de suppression
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === msgId 
                ? { ...msg, isDeleting: false } 
                : msg
            )
          );
        } else {
          setError('Erreur lors de la suppression du message. Le message est supprimé localement.');
          // Simuler une suppression côté client en cas d'erreur API
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
        }
      }
      
      // Fermer le menu contextuel
      setSelectedMessage(null);
      
    } catch (error: any) {
      console.error('❌ [MESSAGE] Erreur lors de la suppression du message:', error);
      setError(error.message || 'Erreur lors de la suppression du message');
      
      // Enlever l'indication de suppression
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === msgId 
            ? { ...msg, isDeleting: false } 
            : msg
        )
      );
    }
  };

  // Envoyer le message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isUserLoggedIn) {
      redirectToLogin();
      return;
    }
    
    if ((!message.trim() && !mediaFile) || !recipient || !userId) return;
    
    setSending(true);
    setError(null);
    
    try {
      // Utiliser le service pour envoyer le message avec ou sans média
      const response = await sendMessage(parseInt(userId), message, mediaFile || undefined);
      
      // Ajouter le message à la liste des messages
      if (response && response.data) {
        setMessages(prevMessages => [...prevMessages, response.data]);
        setHasConversation(true);
      } else {
        // Créer un message temporaire
        const tempMessage: MessageType = {
          id: Date.now(), // ID temporaire
          senderId: currentUser?.id || 0,
          receiverId: parseInt(userId),
          content: message,
          mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : null,
          mediaType: mediaFile ? (mediaFile.type.startsWith('image/') ? 'image' : 'video') : null,
          isRead: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setMessages(prevMessages => [...prevMessages, tempMessage]);
        setHasConversation(true);
        console.warn("Réponse API incomplète, message simulé localement");
      }
      
      // Réinitialiser le champ après envoi
      setMessage('');
      setMediaFile(null);
      setShowMediaPreview(false);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setError(error.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  // Formater l'heure
  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isUserLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">
          <Button variant="ghost" onClick={goBack} className="text-white mr-2">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <Info size={48} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">Connectez-vous pour envoyer des messages</h2>
          <p className="text-gray-400 mb-4 text-center max-w-md">
            Vous devez être connecté pour envoyer et recevoir des messages.
          </p>
          <Button 
            variant="default" 
            onClick={redirectToLogin}
            className="px-6"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !recipient) {
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">
          <Button variant="ghost" onClick={goBack} className="text-white mr-2">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Chargement...</h1>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-white rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* En-tête avec les informations du profil */}
      <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">
        <Button variant="ghost" onClick={goBack} className="text-white mr-2">
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 mr-3">
            {recipient.photo ? (
              <img 
                src={getPhotoUrl(recipient.photo)} 
                alt={recipient.username || `${recipient.firstName} ${recipient.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Éviter les boucles infinies
                  target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22128%22%20height%3D%22128%22%20viewBox%3D%220%200%20128%20128%22%3E%3Crect%20fill%3D%22%23555555%22%20width%3D%22128%22%20height%3D%22128%22%2F%3E%3Ctext%20fill%3D%22%23FFFFFF%22%20font-family%3D%22Arial%22%20font-size%3D%2224%22%20text-anchor%3D%22middle%22%20x%3D%2264%22%20y%3D%2264%22%3E%3F%3C%2Ftext%3E%3C%2Fsvg%3E';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-600 text-white">
                {recipient.firstName.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-medium text-white">
              {recipient.username || `${recipient.firstName} ${recipient.lastName}`}
            </h2>
            {recipient.username && (
              <p className="text-xs text-gray-400">{`${recipient.firstName} ${recipient.lastName}`}</p>
            )}
            {recipient.partnerName && (
              <p className="text-xs text-blue-400">
                {recipient.partnerName} 
                {recipient.partnerRole && <span className="text-gray-400"> • {recipient.partnerRole}</span>}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Utilisation du composant ConversationArea */}
      <ConversationArea 
        messages={messages}
        messageText={message}
        currentUser={currentUser}
        recipient={recipient}
        mediaFile={mediaFile}
        showMediaPreview={showMediaPreview}
        sending={sending}
        error={error}
        
        setMessageText={setMessage}
        handleSendMessage={handleSendMessage}
        handleOpenFileSelector={handleOpenFileSelector}
        handleRemoveMedia={handleRemoveMedia}
        handleMessageClick={handleMessageClick}
        
        formatTime={formatTime}
        getPhotoUrl={getPhotoUrl}
        
        isDarkMode={true}
        
        editingMessage={editingMessage}
        setEditingMessage={setEditingMessage}
        handleEditMessage={handleEditMessage}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        selectedMessage={selectedMessage}
        canModifyMessage={canModifyMessage}
        handleDeleteMessage={handleDeleteMessage}
      />
      
      {/* Input de fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleMediaSelect}
        className="hidden"
        disabled={sending}
      />
    </div>
  );
};

export default MessagePage;
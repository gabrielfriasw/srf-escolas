export const sendWhatsAppMessage = (phone: string, message: string) => {
  // Clean phone number - remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Add country code if not present
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  // Create WhatsApp URL with encoded message
  const url = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(message)}`;
  
  // Open in new tab
  window.open(url, '_blank', 'noopener,noreferrer');
};
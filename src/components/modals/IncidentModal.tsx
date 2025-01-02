import { sendWhatsAppMessage } from '../../utils/whatsapp';

// ... rest of imports

export const IncidentModal: React.FC<IncidentModalProps> = ({
  // ... props
}) => {
  // ... state declarations

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save the incident first
    await onSave({ type, date, description });
    
    // Format and send message
    const message = formatIncidentMessage(
      classData.name,
      student.name,
      type,
      date,
      description
    );
    
    // Send via WhatsApp
    sendWhatsAppMessage(classData.pedagogistPhone, message);
    
    onClose();
  };

  // ... rest of component
};
'use strict';
// Shared message builders keep every WhatsApp entry point consistent.
window.FLEX_CONTACT = {
  messages: {
    general: 'Hey Fex Fenix! Found you through the That’s A Flex website. I’d like to ask about…',
    booking: 'Hey Fex Fenix! I’d like to book a session at That’s A Flex. I’m coming from your website. Can we check availability?',
    beats: 'Hey Fex Fenix! I’m coming from the That’s A Flex website. I’m interested in beats or custom production for my next record.',
    custom: 'Hey Fex Fenix! I’m coming from the That’s A Flex website. I’m interested in custom production for my next record.'
  },
  url(number, message) {
    const digits = String(number || '').replace(/\D/g, '');
    if (!/^\d{8,15}$/.test(digits)) return '';
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  },
  inquiry(data) {
    const labels = {
      name: 'Name / artist name', service: 'Service', date: 'Preferred date',
      time: 'Preferred time (Punta Cana)', hours: 'Approximate hours', message: 'Project details'
    };
    const details = Object.entries(labels)
      .map(([key, label]) => [label, String(data.get(key) || '').trim()])
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`);
    return 'Hey Fex Fenix! I’m coming from the That’s A Flex website. Here’s what I have in mind:\n\n'
      + details.join('\n')
      + '\n\nCan we discuss availability and pricing?';
  }
};

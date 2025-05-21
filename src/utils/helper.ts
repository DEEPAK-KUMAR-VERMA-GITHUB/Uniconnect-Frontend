// Function to format timestamp
export const formatNotificationTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  // remove special characters that could be used for injection
  let sanitized = input.replace(/[${}()=\\'"<>]/g, '').replace(/\s+/, ' ');

  return sanitized;
};

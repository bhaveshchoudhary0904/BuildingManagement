const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  );
};

module.exports = formatDate;
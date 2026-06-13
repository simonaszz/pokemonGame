export function showNotification(message, type = 'success') {
  const notification = document.createElement('div');

  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2500);
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

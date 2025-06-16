const optimizeCloudinaryUrl = (url) => {
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
};

module.exports = optimizeCloudinaryUrl;

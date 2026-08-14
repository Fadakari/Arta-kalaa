export const imageSchema = (imageUrl: string, caption: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: imageUrl,
    url: imageUrl,
    caption: caption,   
  };
};

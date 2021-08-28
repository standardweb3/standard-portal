const normalize = (src) => {
  return src[0] === '/' ? src.slice(1) : src;
};

export const cloudinaryLoader = ({ src }) => {
  return `https://res.cloudinary.com/digital-native/image/fetch/f_auto/${normalize(
    src,
  )}`;
};

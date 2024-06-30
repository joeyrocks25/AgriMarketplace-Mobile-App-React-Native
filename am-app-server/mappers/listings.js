const config = require("config");

const mapper = (listing) => {
  const baseUrl = config.get("assetsBaseUrl");
  const mapImage = (image) => {
    console.log("Image fileName:", image.fileName); // Add this line to log the fileName
    return {
      url: `${baseUrl}${image.fileName}_full.jpg`,
      thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
    };
  };

  console.log("Listing:", listing); // Add this line to log the listing object
  return {
    ...listing,
    images: listing.images.map(mapImage),
  };
};

module.exports = mapper;

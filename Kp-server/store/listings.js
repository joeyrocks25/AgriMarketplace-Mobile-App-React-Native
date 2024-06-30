// Dummy data
const listings = [
  {
    id: 1,
    title: "Cow",
    description:
      "Female beef cow, brown and white, suitable for meat production, healthy and docile. This cow has been raised in a pasture-based system and is accustomed to grazing on grass.",
    images: [{ fileName: "cow1" }],
    price: 1000,
    categoryId: 1,
    userId: "34ffda8f-7492-4a52-a80c-76f5a8a431e00",
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 2,
    title: "Tractor in great condition",
    description:
      "This tractor has been meticulously maintained and is in excellent condition. It has low hours and has never been used for heavy-duty work. Ideal for small to medium-sized farms.",
    images: [{ fileName: "tractor2" }],
    categoryId: 3,
    price: 35000,
    userId: "34ffda8f-7492-4a52-a80c-76f5a8a431e00",
    location: {
      latitude: 54.460429662818754,
      longitude: -5.830717435121883,
    },
  },
  {
    id: 3,
    title: "Cultivator (great condition) - delivery included",
    description:
      "This cultivator is in great condition and comes with free delivery within a 50-mile radius. It's perfect for preparing soil for planting and is easy to maneuver.",
    images: [{ fileName: "cultivator3" }],
    price: 1000,
    categoryId: 2,
    userId: "2",
    location: {
      latitude: 54.460429662818754,
      longitude: -5.830717435121883,
    },
  },
  {
    id: 100,
    title: "Mk7 Golf",
    description:
      "Sleek and stylish Mk7 Golf in excellent condition. Low mileage, well-maintained, and perfect for city driving or long trips. Comes with a full service history and clean interior.",
    images: [{ fileName: "golf4" }],
    categoryId: 4,
    price: 100,
    userId: "2",
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 4,
    title: "Bull",
    description:
      "Sturdy bull suitable for breeding. This bull has a proven track record of siring healthy calves with excellent growth rates. Vaccinated and dewormed regularly.",
    images: [{ fileName: "bull1" }],
    categoryId: 1,
    price: 2000,
    userId: "34ffda8f-7492-4a52-a80c-76f5a8a431e00",
    location: {
      latitude: 54.56259541218416,
      longitude: -5.953039566302392,
    },
  },
  {
    id: 5,
    title: "Sheep",
    description:
      "Healthy and woolly sheep available for sale. These sheep are well-fed and have been regularly sheared. Suitable for breeding or for wool production.",
    images: [{ fileName: "sheep1" }],
    categoryId: 1,
    price: 100,
    userId: "2",
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 6,
    title: "Few Calves",
    description:
      "Group of lively calves available for purchase. These calves are strong and healthy, raised on a diet of high-quality milk and hay. Perfect for starting your own herd.",
    images: [{ fileName: "calves1" }],
    categoryId: 1,
    price: 800,
    userId: "34ffda8f-7492-4a52-a80c-76f5a8a431e00",
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 7,
    title: "Trailer Sprayer",
    description:
      "Durable and efficient trailer sprayer for sale. Suitable for applying fertilizers, herbicides, or pesticides. Features a large tank capacity and adjustable spray nozzles.",
    images: [{ fileName: "trailed_sprayer1" }],
    categoryId: 2,
    price: 500,
    userId: "2",
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 8,
    title: "Jumbo Ripper",
    description:
      "Heavy-duty jumbo ripper designed for breaking up hard soil and preparing it for planting. Features multiple tines and sturdy construction for long-lasting performance.",
    images: [{ fileName: "jumbo_ripper1" }],
    categoryId: 2,
    price: 700,
    userId: "2",
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 9,
    title: "Used Tractor",
    description:
      "Reliable used tractor available for purchase. This tractor has served its previous owner well and is ready for a new home. Suitable for a variety of agricultural tasks.",
    images: [{ fileName: "tractor3" }],
    categoryId: 3,
    price: 50000,
    userId: "2",
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 10,
    title: "Tractor",
    description:
      "Brand new tractor available for sale. This tractor is loaded with features and is perfect for heavy-duty agricultural work. Comes with a warranty and financing options.",
    images: [{ fileName: "tractor4" }],
    categoryId: 3,
    price: 75000,
    userId: "2",
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
];

const addListing = (listing) => {
  listing.id = listings.length + 1;
  listings.push(listing);
};

const getListings = () => listings;

const getListing = (id) => listings.find((listing) => listing.id === id);

const filterListings = (predicate) => listings.filter(predicate);

// New function to perform the search
const searchListings = (searchText) => {
  if (!searchText || searchText.trim() === "") {
    // Return all listings if searchText is empty
    return listings;
  }

  // Filter listings based on the title containing searchText
  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return filteredListings;
};

const countListingsByUserId = (userId) => {
  return listings.filter((listing) => listing.userId === userId).length;
};

module.exports = {
  addListing,
  getListings,
  getListing,
  filterListings,
  searchListings, // Export the search function
  countListingsByUserId,
};

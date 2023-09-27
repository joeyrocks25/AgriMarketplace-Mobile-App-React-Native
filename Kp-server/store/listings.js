const listings = [
  {
    id: 1,
    title: "Cow",
    description:
      "Female beef cow, brown and white, suitable for meat production, healthy and docile.",
    images: [{ fileName: "cow1" }],
    price: 1000,
    categoryId: 1,
    userId: 1,
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 2,
    title: "Tractor in great condition",
    description: "Kept well, tidy yoke.",
    images: [{ fileName: "tractor2" }],
    categoryId: 3,
    price: 35000,
    userId: 1,
    location: {
      latitude: 54.460429662818754,
      longitude: -5.830717435121883,
    },
  },
  {
    id: 3,
    title: "cultivator (great condition) - delivery included",
    // description:
    //   "I'm selling my furniture at a discount price. Pick up at Venice. DM me asap.",
    images: [{ fileName: "cultivator3" }],
    price: 1000,
    categoryId: 2,
    userId: 2,
    location: {
      latitude: 54.460429662818754,
      longitude: -5.830717435121883,
    },
  },
  {
    id: 100,
    title: "mk7 golf",
    images: [{ fileName: "golf4" }],
    categoryId: 4,
    price: 100,
    userId: 2,
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 4,
    title: "Bull",
    images: [{ fileName: "bull1" }],
    categoryId: 1,
    price: 2000,
    userId: 1,
    location: {
      latitude: 54.56259541218416,
      longitude: -5.953039566302392,
    },
  },
  {
    id: 5,
    title: "sheep",
    images: [{ fileName: "sheep1" }],
    categoryId: 1,
    price: 100,
    userId: 2,
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 6,
    title: "Few calves",
    images: [{ fileName: "calves1" }],
    categoryId: 1,
    price: 800,
    userId: 1,
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 7,
    title: "Trailer sprayer",
    images: [{ fileName: "trailed_sprayer1" }],
    categoryId: 2,
    price: 500,
    userId: 2,
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 8,
    title: "Jumbo ripper",
    images: [{ fileName: "jumbo_ripper1" }],
    categoryId: 2,
    price: 700,
    userId: 2,
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 9,
    title: "Used tractor",
    images: [{ fileName: "tractor3" }],
    categoryId: 3,
    price: 50000,
    userId: 2,
    location: {
      latitude: 54.24860308279903,
      longitude: -6.70498370564887,
    },
  },
  {
    id: 10,
    title: "Tractor",
    images: [{ fileName: "tractor4" }],
    categoryId: 3,
    price: 75000,
    userId: 2,
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

module.exports = {
  addListing,
  getListings,
  getListing,
  filterListings,
  searchListings, // Export the search function
};

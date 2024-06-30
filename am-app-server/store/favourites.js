const favourites = [];

const addFavourite = (favourite) => {
  favourites.push(favourite);
};

const getFavourites = () => favourites;

const getFavourite = (id) =>
  favourites.find((favourite) => favourite.id === id);

const deleteFavourite = (id) => {
  const index = favourites.findIndex((favourite) => favourite.id === id);
  if (index !== -1) {
    favourites.splice(index, 1);
  }
};

const filterFavourites = (predicate) => favourites.filter(predicate);

const isFavouriteAlreadyExists = (currentUserId, listingId) => {
  return favourites.some(
    (favourite) =>
      favourite.currentUserId === currentUserId &&
      favourite.listingId === listingId
  );
};

module.exports = {
  addFavourite,
  getFavourites,
  getFavourite,
  deleteFavourite,
  filterFavourites,
  isFavouriteAlreadyExists,
};

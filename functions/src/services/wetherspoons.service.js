const requestPromise = require('request-promise');

const getVenues = () => requestPromise('https://static.wsstack.nn4maws.net/v1/venues/en_gb/venues.json', { json: true });

const flatten = (arrays) => [].concat.apply([], arrays);

const getDrinks = async (venueId) => {
  const response = await requestPromise(`https://static.wsstack.nn4maws.net/content/v1/menus/${venueId}.json`, { json: true });
  const drinksObjs = response.menus.find((element) => element.name === 'Drinks');
  const drinks = flatten(
    flatten(
      drinksObjs.subMenu.map(({ productGroups }) => productGroups),
    )
      .map(({ products }) => products),
  );
  console.log(drinks)
  return drinks;
};

const getDrink = (drinks, roundOn, rounds) => {
    const drink = drinks[Math.floor(Math.random() * drinks.length)];
    return drink
};





module.exports = {
  getVenues,
  getDrinks,
  getDrink
};

const { getDrinks, getRandomDrink } = require('./wetherspoons.service');

const toString = ({ x, y }) => `${y}-${x}`;
const getChildren1 = ({x, y}) => [{ x: x, y: y + 1 }, { x: x + 1, y: y + 1  }];
const isHalfWay = (r, rounds) => r >= (rounds + 1) / 2;
const getWidth = (r, rounds) => isHalfWay(r, rounds) ? 2 + rounds - r : 3 + r;
const getChildren2 = ({x, y}, rounds) => {
  const newWidth = getWidth(y + 1, rounds);
  return [{ x: (x + newWidth - 1) % newWidth, y: y + 1 }, { x: x % newWidth, y: y + 1  }];
};

const process = async (obj, r, rounds, venueId) => {
  const children = isHalfWay(r, rounds) ? getChildren2(obj, rounds) : getChildren1(obj);
  const drink = await getRandomDrink(venueId)

  return { children, drink, obj };
}

const tree = async (rounds, venueId) => {
    let currentRow = [{ x: 0, y: 0}, { x: 1, y: 0}, { x: 2, y: 0}];
    const treesObj = { start: { children: currentRow.map(child => toString(child)) }, end: { children: [] } };
    for(let r = 1; r < rounds; r++ ) {
      let nextRow = [];

      const processedNodes = await Promise.all(currentRow.map(node => process(node, r, rounds, venueId)));

      processedNodes.forEach(({ children, drink, obj }) => {
        nextRow = nextRow.concat(children)
        treesObj[toString(obj)] = { 
          children: children.map(child => toString(child)), 
          drink
        };
      })
      // currentRow.forEach( async ({x, y}) => {
      //     const children = isHalfWay(r, rounds) ? getChildren2({x, y}, rounds) : getChildren1({x, y});
      //     nextRow = nextRow.concat(children)
      //     const drink = await getRandomDrink(venueId)
      //     treesObj[toString({x, y})] = { 
      //       children: children.map(child => toString(child)), 
      //       drink
      //     };
      // });
      currentRow = nextRow;
    }

    const randomDrinks = await Promise.all([0, 0, 0].map(() => getRandomDrink(venueId)))
    for(let x = 0; x < 3; x++) {
      treesObj[toString({x,y:rounds - 1})] = { children: ['end'], drink: randomDrinks[x] };
    }
    return treesObj

}
module.exports = {tree};

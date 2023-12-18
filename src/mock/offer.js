import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { POINT_TYPES } from '../const.js';

const OFFER_TITLES = [
  'Upgrade to a business class',
  'Order Uber', 'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast'
];

const MIN_OFFER_PRICE = 20;
const MAX_OFFER_PRICE = 250;

const MIN_OFFERS_COUNT = 2;
const MAX_OFFERS_COUNT = 8;

const createOffer = (index) => ({
  id: index + 1,
  title: getRandomArrayElement(OFFER_TITLES),
  price: getRandomInteger(MIN_OFFER_PRICE, MAX_OFFER_PRICE)
});

const createOfferByType = () => ({
  type: getRandomArrayElement(POINT_TYPES),
  offers: Array.from({ length: getRandomInteger(MIN_OFFERS_COUNT, MAX_OFFERS_COUNT)}, (_, index) => createOffer(index))
});

export { createOfferByType };

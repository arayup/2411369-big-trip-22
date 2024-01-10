import { nanoid } from 'nanoid';
import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { POINT_TYPES } from '../const.js';
import { createRandomDates } from './dates.js';
import { createDestination } from './destination.js';
import { createOfferByType } from './offer.js';

const DESTINATION_COUNT = 5;
const OFFERS_BY_TYPE_COUNT = 10;

const MIN_PRICE = 1000;
const MAX_PRICE = 3000;

const offersByType = Array.from({ length: OFFERS_BY_TYPE_COUNT }, createOfferByType);
const destinations = Array.from({ length: getRandomInteger(1, DESTINATION_COUNT) }, (_, index) => createDestination(index));

const getRandomIdsArray = () => {
  const randomOffers = getRandomArrayElement(offersByType).offers;

  const ids = [];
  const lengthOfArray = getRandomInteger(1, randomOffers.length);
  while (ids.length < lengthOfArray) {
    const currentElement = getRandomInteger(0, randomOffers.length);
    if (!ids.includes(currentElement)) {
      ids.push(currentElement);
    }
  }

  return ids;
};

const createPoint = () => {
  const randomDates = createRandomDates();

  return {
    id: nanoid(),
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: randomDates.dateFrom,
    dateTo: randomDates.dateTo,
    destination: getRandomArrayElement(destinations).id,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getRandomIdsArray(),
    type: getRandomArrayElement(POINT_TYPES)
  };
};

const createMockPoints = (count) => Array.from({ length: count }, createPoint);

export { createMockPoints, offersByType, destinations };

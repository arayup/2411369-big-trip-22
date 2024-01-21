import { FilterType } from '../const.js';
import { isPastEvent, isPresentEvent, isFutureEvent } from './point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isFutureEvent),
  [FilterType.PRESENT]: (points) => points.filter(isPresentEvent),
  [FilterType.PAST]: (points) => points.filter(isPastEvent)
};

export { filter };

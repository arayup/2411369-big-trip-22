import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const messagesByFilter = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

const createListMessageTemplate = (filterType) => `<p class="trip-events__msg">${messagesByFilter[filterType]}</p>`;

export default class PointListMessageView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    return createListMessageTemplate(this.#filterType);
  }
}

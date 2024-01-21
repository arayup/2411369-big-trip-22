import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filters, currentFilterType) => {
  const renderFilter = filters.map((filter) =>
    `<div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${filter.count === 0 ? 'disabled' : ''} ${filter.name === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}" ${filter.count === 0 ? 'disabled' : ''}>${filter.name}</label>
    </div>`).join('');

  return `<form class="trip-filters" action="#" method="get">
      ${renderFilter}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}


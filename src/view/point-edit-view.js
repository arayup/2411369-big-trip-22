import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { ucFirst } from '../utils/common.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const DEFAULT_TYPE = 'taxi';

const DefaultPointData = {
  DATE_FROM: dayjs().toISOString(),
  DATE_TO: dayjs().add(30, 'minutes').toISOString()
};

const BLANK_POINT = {
  basePrice: '',
  dateFrom: DefaultPointData.DATE_FROM,
  dateTo: DefaultPointData.DATE_TO,
  destination: '',
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const createPointEditTemplate = (point, offersByType, destinations) => {
  const { type, dateFrom, dateTo, basePrice, destination, offers, isDisabled, isSaving, isDeleting } = point;

  const isNewPoint = !point.id;
  const isSubmitDisabled = destination && basePrice;
  const submitBtnText = isSaving ? 'Saving...' : 'Save';
  const deleteBtnText = isDeleting ? 'Deleting...' : 'Delete';
  const resetBtnText = isDisabled ? 'Cancel' : deleteBtnText;

  const pointTypeOffer = offersByType.find((offer) => offer.type === type);
  const pointDestination = destinations.find((appointment) => destination === appointment.id);

  let offersTemplate = '';
  if (pointTypeOffer) {
    offersTemplate = `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${pointTypeOffer.offers.map((offer) => `
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="${offer.title}" data-offer-id="${offer.id}" ${offers.includes(offer.id) ? 'checked' : ''}>
                <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.price}</span>
                </label>
              </div>`).join('')}
            </div>
        </section>`;
  }

  let pointDestinationTemplate = '';
  if (pointDestination) {
    pointDestinationTemplate = `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pointDestination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
          </div>
        </div>
      </section>`;
  }

  const destinationNameTemplate = destinations.map((element) => `<option value="${element.name}"></option>`).join('');

  const eventTypeTemplate = offersByType.map((offer) => `
    <div class="event__type-item">
      <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${offer.type === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${ucFirst(offer.type)}</label>
    </div>`
  ).join('');

  const parsDateTo = dayjs(dateTo);
  const parsDateFrom = dayjs(dateFrom);

  const createRollupBtn = () => isNewPoint ? '' : '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypeTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-1" required>
          <datalist id="destination-list-1">
            ${destinationNameTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${parsDateFrom.format(DATE_FORMAT)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${parsDateTo.format(DATE_FORMAT)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value=${point.basePrice ? basePrice : 0} required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled || isDisabled ? '' : 'disabled'}>${submitBtnText}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${resetBtnText}</button>
        ${createRollupBtn()}
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${pointDestinationTemplate}
      </section>
    </form>
  </li>`;
};

export default class PointEditView extends AbstractStatefulView {
  #offersByType = null;
  #destinations = null;

  #handleFormSubmit = null;
  #handleRollupButtonClick = null;
  #handleResetButtonClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point = BLANK_POINT, offersByType, destinations, onFormSubmit, onRollupButtonClick, onResetButtonClick }) {
    super();

    this._setState(PointEditView.parsePointToState(point));
    this.#offersByType = offersByType;
    this.#destinations = destinations;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;
    this.#handleResetButtonClick = onResetButtonClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#offersByType, this.#destinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeToggleHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationToggleHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputHandler);
    this.element.querySelectorAll('.event__offer-selector input')
      .forEach((offer) => offer.addEventListener('change', this.#offersChangeHandler));
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    if (this._state.id) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#rollupButtonClickHandler);
    }

    this.#setDatepicker();
  }

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #eventDestinationToggleHandler = (evt) => {
    evt.preventDefault();

    let selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);

    if (!selectedDestination) {
      selectedDestination = '';
    }

    this.updateElement({
      destination: selectedDestination.id
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: evt.target.value
    });
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    evt.target.toggleAttribute('checked');

    let selectedOffers = this._state.offers;

    if (evt.target.hasAttribute('checked')) {
      selectedOffers.push(+(evt.target.dataset.offerId));
    } else {
      selectedOffers = selectedOffers.filter((id) => id !== +(evt.target.dataset.offerId));
    }

    this._setState({
      offers: selectedOffers
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetButtonClick(PointEditView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom
    });
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo
    });
  };

  #setDatepicker() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {firstDayOfWeek: 1},
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        maxDate: this._state.dateTo
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
        minDate: this._state.dateFrom
      }
    );
  }
}

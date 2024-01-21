import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplte = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type = "button"> New event</button>';

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({ onClick }) {
    super();

    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplte();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}

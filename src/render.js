export const renderComponent = (markup, container, repeat = 1, position = `beforeend`, callback = () => undefined) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(position, markup);
  }
  callback();
};

export const renderComponent = (markup, container, repeat = 1, position = `beforeend`, callback = () => undefined) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(position, markup);
  }
  callback();
};

// export const renderTripItem = (container, mockItem) => {
//   let {type} = mockItem;
//   container.insertAdjacentHTML(`beforeend`, getEventItemTemplate({type,}));
//   // tasksForLoad = tasksForLoad.slice(1);
// };

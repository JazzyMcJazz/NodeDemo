function doingSomething(anyFunctionReference, name) {
  anyFunctionReference(name);
}

// const running = (name) => console.log(`${name} is running`);
// const drinking = (name) => `${name} is drinking`;
// const result = () => doingSomething(drinking, 'Chris');
// result();

const result = () =>
  doingSomething((name) => console.log(`${name} is studying`), 'Peri');

result();

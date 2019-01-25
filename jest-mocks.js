// require('jest-canvas-mock');

// Mocking scrollTo method, which is not implemented in jsdom
Object.defineProperty(window, 'scrollTo', {
  value: () => undefined,
});

// Mocking createObjectURL method, which is not implemented in jsdom
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: () => undefined,
  },
});

// Mocking location.reload method, to prevent reload
Object.defineProperty(location, 'reload', {
  value: () => undefined,
});

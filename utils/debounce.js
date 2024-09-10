let timeoutId;

export function debounce(func, delay) {
  return async function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      console.log(`Executing debounced function with args:`, args);
      await func.apply(this, args);
    }, delay);
  };
}

import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.form'),
  firstDelay: document.querySelector('input[type="number"][name="delay"]'),
  delayStep: document.querySelector('input[type="number"][name="step"]'),
  setAmount: document.querySelector('input[type="number"][name="amount"]'),
};

refs.form.addEventListener('submit', onSubmitForm);

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function onSubmitForm(e) {
  e.preventDefault();

  let delay = Number(refs.firstDelay.value);
  const step = Number(refs.delayStep.value);
  const amount = Number(refs.setAmount.value);
  e.currentTarget.reset();

  for (let position = 1; position <= amount; position += 1) {
    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(
          `❌ Rejected promise ${position} in ${delay}ms`
        );
      });
    delay += step;
  }
}

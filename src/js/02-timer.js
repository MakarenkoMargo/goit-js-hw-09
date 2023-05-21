import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

let finalTime = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: onSelectDateClose,
};

flatpickr('#datetime-picker', options);

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};
refs.startBtn.disabled = true;

class CountdownTimer {
  constructor({ onChange }) {
    this.intevalId = null;
    this.isActive = false;
    this.onChange = onChange;
  }
  start() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;

    this.intervalId = setInterval(() => {
      const deltaTime = finalTime - Date.now();
      if (deltaTime > 0) {
        const time = this.convertMs(deltaTime);
        this.onChange(time);
      } else {
        this.stop();
      }
    }, 1000);
  }
  stop() {
    clearInterval(this.intevalId);
    this.isActive = false;
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days, hours, minutes, seconds
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}

const countdownTimer = new CountdownTimer({
  onChange: updateTime,
});

refs.startBtn.addEventListener('click', () => {
  countdownTimer.start();
  refs.startBtn.disabled = true;
});

function onSelectDateClose(selectedDates) {
  if (selectedDates[0].getTime() > Date.now()) {
    finalTime = selectedDates[0].getTime();
    refs.startBtn.disabled = false;
  } else {
    Notiflix.Notify.failure('Please choose a date in the future');
  }
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTime({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

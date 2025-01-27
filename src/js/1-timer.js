import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const startButton = document.querySelector('[data-start]');
startButton.disabled = true;
let userSelectedDate = null;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

const timer = {
  deadLine: null,
  intervalId: null,
  elements: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },

  start() {
    if (this.intervalId) return;
    if (!userSelectedDate) return;
    this.deadLine = userSelectedDate;

    startButton.disabled = true;
    document.querySelector('#datetime-picker').disabled = true;

    this.intervalId = setInterval(() => {
      const ms = this.deadLine - Date.now();

      if (ms <= 0) {
        this.stop();
        return;
      }

      const timeComponents = convertMs(ms);

      this.elements.days.textContent = this.addLeadingZero(timeComponents.days);
      this.elements.hours.textContent = this.addLeadingZero(
        timeComponents.hours
      );
      this.elements.minutes.textContent = this.addLeadingZero(
        timeComponents.minutes
      );
      this.elements.seconds.textContent = this.addLeadingZero(
        timeComponents.seconds
      );
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);

    document.querySelector('#datetime-picker').disabled = false;
  },

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  },
};

startButton.addEventListener('click', () => {
  timer.start();
});

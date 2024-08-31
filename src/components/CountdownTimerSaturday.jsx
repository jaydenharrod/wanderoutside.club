import { createSignal, onCleanup, onMount } from "solid-js";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = createSignal(calculateTimeLeft());

  function calculateTimeLeft() {
    const targetDate = getNextSaturdayEvent();
    const difference = targetDate - new Date();

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  function getNextSaturdayEvent() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const daysUntilNextSaturday = (6 - dayOfWeek + 7) % 7 || 7; // 6 corresponds to Saturday
    const nextSaturday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilNextSaturday,
      14, // 2:00 pm in 24-hour format
      0,
      0,
      0
    );

    return nextSaturday;
  }

  onMount(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    onCleanup(() => {
      clearInterval(timer);
    });
  });

  return (
    <div className="mt-2">
      {Object.keys(timeLeft()).length ? (
        <div>
          <p>Sunday 2:00 pm AEST:</p>
          <time
            datetime=""
            id="timeDisplay"
            class="text-2xl xl:text-2xl xl:whitespace-nowrap font-serif flex items-center"
          >
            {timeLeft().days} days - {timeLeft().hours} hours -{" "}
            {timeLeft().minutes} minutes
          </time>
        </div>
      ) : (
        <p>Countdown complete!</p>
      )}
      <p className="mt-2 opacity-50">See Instagram to confirm event details</p>
    </div>
  );
};

export default Countdown;

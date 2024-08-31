import { createSignal, onCleanup, onMount } from "solid-js";
import { differenceInSeconds } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = createSignal(calculateTimeLeft());

  function calculateTimeLeft() {
    const targetDate = getNextEvent();
    const now = new Date();
    const difference = differenceInSeconds(
      targetDate,
      toZonedTime(now, "Australia/Sydney")
    );

    if (difference > 0) {
      return {
        days: Math.floor(difference / (60 * 60 * 24)),
        hours: Math.floor((difference / (60 * 60)) % 24),
        minutes: Math.floor((difference / 60) % 60),
        seconds: difference % 60,
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }

  function getNextEvent() {
    const now = toZonedTime(new Date(), "Australia/Sydney");
    const nextSaturday = new Date(now);
    nextSaturday.setDate(
      nextSaturday.getDate() + (6 + 7 - nextSaturday.getDay() + (7 % 7))
    );
    nextSaturday.setHours(14, 0, 0, 0); // Set time to 2:00 PM in the timezone

    // Check if the next Saturday is after the current date
    if (nextSaturday <= now) {
      // If it is, add 14 days to get the next fortnightly Saturday
      nextSaturday.setDate(nextSaturday.getDate() + 14);
    }

    return new Date(
      formatInTimeZone(
        nextSaturday,
        "Australia/Sydney",
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      )
    );
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
          <p>Saturday 2:00 pm AEST:</p>
          <time
            id="timeDisplay"
            class="text-2xl xl:text-2xl xl:whitespace-nowrap font-serif flex items-center"
          >
            {timeLeft().days}d - {timeLeft().hours}h - {timeLeft().minutes}m
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

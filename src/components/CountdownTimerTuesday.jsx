import { createSignal, onCleanup, onMount } from "solid-js";
import { differenceInSeconds } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { LINKS } from "../lib/constants";

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
    const nextTuesday = new Date(now);
    nextTuesday.setDate(
      nextTuesday.getDate() + (2 + 7 - nextTuesday.getDay() + (7 % 7))
    );
    nextTuesday.setHours(6, 30, 0, 0); // Set time to 6:30 AM in the timezone

    return new Date(
      formatInTimeZone(
        nextTuesday,
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
        <div className="flex flex-col space-between">
          <time
            id="timeDisplay"
            class="text-2xl xl:text-2xl xl:whitespace-nowrap font-serif flex items-center"
          >
            {timeLeft().days}d - {timeLeft().hours}h - {timeLeft().minutes}m
          </time>
          <p className="text-sm opacity-70">Tuesday 6:30 am</p>
          <a className="mt-4 text-sm" href={LINKS.instagram}>
            See event details on Instagram
          </a>
        </div>
      ) : (
        <p>Countdown complete!</p>
      )}
    </div>
  );
};

export default Countdown;

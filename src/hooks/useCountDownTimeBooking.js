import { useState, useRef, useEffect } from "react";

export const useCountDownTimeBooking = (setIsShowModalAlert) => {
  const ONE_SECONDS = 1000;
  const idSetInterval = useRef();
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  const countdown = () => {
    idSetInterval.current = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setIsShowModalAlert(true);
          clearInterval(idSetInterval.current);
        } else {
          setMinutes(minutes - 1);
          setSeconds(() => 59);
        }
      }
    }, ONE_SECONDS * 1);
  };

  useEffect(() => {
    countdown();
    return () => {
      clearInterval(idSetInterval.current);
    };
  }, [seconds]);
  return { idSetInterval, minutes, seconds };
};
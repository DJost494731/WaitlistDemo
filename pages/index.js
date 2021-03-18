import axios from "axios";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  var [reservations, setReservations] = useState([]);
  useInterval(() => {
    getReservations().then((result) => {
      console.log(result);
      setReservations(result);
    });
  }, 1000);

  return (
    <div className={styles.container}>
      <Head>
        <title>Waitlist Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Open Reservations</h1>
        <div className={styles.grid}>
          {reservations.map((reservation) => (
            <div className={styles.card}>
              <div className={styles.row}>
                <h3>{reservation.CustomerID}</h3>
                <h5>Number Of Guests: {reservation.NumberOfGuests}</h5>
              </div>
              <p>
                Waiting for{" "}
                {getMinutesSince(reservation.TimePlacedUTC + " UTC")} minutes
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function getMinutesSince(time) {
  var countDownDate = new Date(time);

  var now = new Date();
  var diffMs = now - countDownDate;

  return Math.round(((diffMs % 86400000) % 3600000) / 60000);
}

async function getReservations() {
  return (
    await axios.get(
      "https://2umw2103pa.execute-api.us-west-2.amazonaws.com/Prod/reservations"
    )
  ).data;
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

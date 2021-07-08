import React from "react";

import Calendar from "./Calendar";

export default function App() {
  const [calendarEvents, setCalendarEvents] = React.useState([
    {
      title: "Atlanta Monster",
      start: new Date("2020-12-30 00:00"),
      backgroundColor: "pink",
      id: "99999998",
    },
    {
      title: "My Favorite Murder",
      start: new Date("2019-04-05 00:00"),
      id: "99999999",
    },
    {
      title: "Beef Broccoli (Example)",
      start: new Date("2020-12-31 00:00"),
      id: "2",
      backgroundColor: "red",
      border: "pink",
    },
  ]);
  return (
    <>
      <Calendar calendarEvents={calendarEvents} />
    </>
  );
}

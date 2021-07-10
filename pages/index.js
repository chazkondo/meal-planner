import React, { useEffect, useState, useRef, memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

const ExternalEvent = memo(({ event }) => {
  let elRef = useRef(null);

  useEffect(() => {
    let draggable = new Draggable(elRef.current, {
      eventData: function () {
        return { ...event, create: true };
      }
    });

    // a cleanup function
    return () => draggable.destroy();
  });

  return (
    <div
      ref={elRef}
      className="fc-event fc-h-event mb-1 fc-daygrid-event fc-daygrid-block-event p-2"
      title={event.title}
      style={{
        backgroundColor: event.color,
        borderColor: event.color,
        cursor: "pointer"
      }}
    >
      <div className="fc-event-main">
        <div>
          <strong>{event.title}</strong>
        </div>
      </div>
    </div>
  );
});

export default function App() {
  // initial state
  const [state, setState] = useState({
    weekendsVisible: true,
    externalEvents: [
      { title: "Curry Stew", color: "#0097a7", id: 34432 },
      { title: "Beef Broccoli", color: "#f44336", id: 323232 },
      { title: "Cereal", color: "#f57f17", id: 1111 },
      { title: "Pancakes", color: "#90a4ae", id: 432432 }
    ],
    calendarEvents: [
      {
        id: 1,
        title: "All-day event",
        color: "#388e3c",
        start: "2020-12-12",
        end: "2020-12-12"
      },
      {
        id: 2,
        title: "Timed event",
        color: "#0097a7",
        start: "2020-12-07",
        end: "2020-12-10"
      }
    ]
  });

  // add external events
  const addEvent = () => {
    let newEvent = {
      id: 3433,
      title: "Timed event",
      color: "#333333",
      start: "2020-12-31",
      end: "2020-12-31",
      custom: "custom stuff"
    };

    setState((state) => {
      return {
        ...state,
        externalEvents: state.externalEvents.concat(newEvent)
      };
    });
  };

  // handle event receive
  const handleEventReceive = (eventInfo) => {
    const newEvent = {
      id: eventInfo.draggedEl.getAttribute("data-id"),
      title: eventInfo.draggedEl.getAttribute("title"),
      color: eventInfo.draggedEl.getAttribute("data-color"),
      start: eventInfo.date,
      end: eventInfo.date,
      custom: eventInfo.draggedEl.getAttribute("data-custom")
    };

    setState((state) => {
      return {
        ...state,
        calendarEvents: state.calendarEvents.concat(newEvent)
      };
    });
  };

  return (
    <div className="App">
      <div style={{ float: "left", width: "25%" }}>
        <div style={{ margin: "0 0 20px" }}>
          <input
            type="submit"
            name="name"
            onClick={addEvent}
            value="add external event"
          />
        </div>
        <div id="external-events">
          {state.externalEvents.map((event) => (
            <ExternalEvent key={event.id} event={event} />
          ))}
        </div>
      </div>
      <div style={{ float: "left", width: "75%" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: null,
            center: "title",
          }}
          initialView="dayGridMonth"
          eventDurationEditable={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={3}
          weekends={state.weekendsVisible}
          events={state.calendarEvents}
          droppable={true}
          eventReceive={handleEventReceive}
        />
      </div>
    </div>
  );
}

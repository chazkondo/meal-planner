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
      className="fc-event fc-h-event mb-1 fc-daygrid-event fc-daygrid-block-event p-2 recipe"
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

  const [checked, setChecked] = useState(false)
  const [expandedView, setExpandedView] = useState(1)
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
    console.log('this got fired')
    console.log(eventInfo, 'hi')
    const newEvent = {
      id: eventInfo.draggedEl.getAttribute("data-id"),
      title: eventInfo.draggedEl.getAttribute("title"),
      color: eventInfo.draggedEl.getAttribute("data-color"),
      _date: eventInfo.event.start,
      custom: eventInfo.draggedEl.getAttribute("data-custom"),
      _instance: eventInfo.event._instance.defId
    };

    setState((state) => {
      return {
        ...state,
        calendarEvents: state.calendarEvents.concat(newEvent)
      };
    });
  };

    // handle event move
    const handleEventMove = (e) => {
      const event = state.calendarEvents.find(item=>item._instance === e.event._instance.defId)
      event._date = e.event.start
      // const newEvent = {
      //   id: eventInfo.draggedEl.getAttribute("data-id"),
      //   title: eventInfo.draggedEl.getAttribute("title"),
      //   color: eventInfo.draggedEl.getAttribute("data-color"),
      //   start: eventInfo.date,
      //   end: eventInfo.date,
      //   custom: eventInfo.draggedEl.getAttribute("data-custom")
      // };
  
      // setState((state) => {
      //   return {
      //     ...state,
      //     calendarEvents: state.calendarEvents.concat(newEvent)
      //   };
      // });
    };

  function handleCheck(e) {
    if (e.target.checked) {
      setExpandedView(5)
    } else {
      setExpandedView(1)
    }
    setChecked(e.target.checked)
  }

  return (
    <div className="App">
      <div className="recipe-wrapper">
        <div className="recipe-title flex-center">
          <input
            type="submit"
            name="name"
            onClick={addEvent}
            value="add recipe"
          />
        </div>
        <div id="external-events">
          {state.externalEvents.map((event) => (
            <ExternalEvent key={event.id} event={event} />
          ))}
        </div>
      </div>
      <div className="calendar-wrapper">
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
          dayMaxEvents={expandedView}
          weekends={state.weekendsVisible}
          events={state.calendarEvents}
          droppable={true}
          fixedWeekCount={false}
          eventReceive={handleEventReceive}
          eventDrop={handleEventMove}
        />
      <div style={{color: 'white'}}>Expanded View <input style={{marginTop: 20}} type="checkbox" defaultChecked={checked} onChange={e=>handleCheck(e)} /></div>
      <div><button onClick={()=>console.log(state, 'heres the state for u')}>check state</button></div>
      </div>
    </div>
  );
}

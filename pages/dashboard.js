// test
import React, { useEffect, useState, useRef, memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

import Alert from "sweetalert2";

const Recipe = memo(({ event }) => {
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
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [recipes, updateRecipes] = useState([
    { title: "Curry Stew", color: "#0097a7", id: 34432 },
    { title: "Beef Broccoli", color: "#f44336", id: 323232, ingredients: [{name: 'Beef', amount: null, type: 'Protein'}, {name: 'Broccoli', amount: '2 heads'}, {name: 'Rice', amount: '3 cups'}, {name: 'Soy Sauce', amount: '3 Tablespoons'}, {name: 'Ginger', amount: '2 Tablespoons'}] },
    { title: "Cereal", color: "#f57f17", id: 1111 },
    { title: "Pancakes", color: "#90a4ae", id: 432432 }
  ])
  const [calendar, updateCalendar] = useState([])

  // add external events
  const addRecipe = () => {
    let newRecipe = {
      id: 3433,
      title: "Timed event",
      color: "#333333",
      start: "2020-12-31",
      end: "2020-12-31",
      custom: "custom stuff"
    };

    updateRecipes(previous => [...previous, newRecipe]
    );
  };

  // handle event receive
  const handleEventReceive = (eventInfo) => {
    const newEvent = {
      id: eventInfo.draggedEl.getAttribute("data-id"),
      title: eventInfo.draggedEl.getAttribute("title"),
      color: eventInfo.draggedEl.getAttribute("data-color"),
      _date: eventInfo.event.start,
      custom: eventInfo.draggedEl.getAttribute("data-custom"),
      _instance: eventInfo.event._instance.defId
    };

    updateCalendar(previous=>[...previous, newEvent]);
  };

    // handle event move
    const handleEventMove = (e) => {
      const event = calendar.find(item=>item._instance === e.event._instance.defId)
      event._date = e.event.start
    };

  function handleCheck(e) {
    if (e.target.checked) {
      setExpandedView(5)
    } else {
      setExpandedView(1)
    }
    setChecked(e.target.checked)
  }

  function getIngredients(id) {
    const parsedId = parseFloat(id);
    const recipe = recipes.find(element=>element.id === parsedId).ingredients

    return recipe.map(ingredient=>` <span>${ingredient.name}${ingredient.amount ? (' (' + ingredient.amount + ')') : ''}</span>`)
  }

  function eventClick(eventClick) {
    Alert.fire({
      title: eventClick.event.title + '<div style="font-size: 20">' + eventClick.event.start.toString().slice(0, 15) + '</div>',
      html:
      `<div>` +
        getIngredients(eventClick.event._def.publicId) +
      '</div>',

      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove Event",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.value) {
        const newArr = calendar.filter(events => events._instance !== eventClick.event._instance.defId)
        updateCalendar(newArr)
        eventClick.event.remove(); // It will remove event from the calendar
        Alert.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };
  

  return (
    <div className="App">
      <div className="recipe-wrapper">
        <div className="recipe-title flex-center">
          <input
            type="submit"
            name="name"
            onClick={addRecipe}
            value="add recipe"
          />
        </div>
        <div id="all-recipes">
          {recipes.map((event) => (
            <Recipe key={event.id} event={event} />
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
          weekends={weekendsVisible}
          events={calendar}
          droppable={true}
          fixedWeekCount={false}
          eventReceive={handleEventReceive}
          eventDrop={handleEventMove}
          eventClick={eventClick}
        />
      <div style={{color: 'white'}}>Expanded View <input style={{marginTop: 20}} type="checkbox" defaultChecked={checked} onChange={e=>handleCheck(e)} /></div>
      <div><button onClick={()=>console.log(calendar, 'heres the state for u')}>Login</button></div>
      </div>
    </div>
  );
}

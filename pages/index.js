import React, { useEffect, useState, useRef, memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Link from 'next/link'

import Alert from "sweetalert2";
import axios from "axios";

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const Recipe = memo(({ item }) => {
  let elRef = useRef(null);

  useEffect(() => {
    let draggable = new Draggable(elRef.current, {
      eventData: function () {
        return { ...item, create: true };
      }
    });

    // a cleanup function
    return () => draggable.destroy();
  });

  return (
    <div
      ref={elRef}
      className="fc-event fc-h-event mb-1 fc-daygrid-event fc-daygrid-block-event p-2 recipe"
      name={item.name}
      style={{
        backgroundColor: item.color,
        borderColor: item.color,
        cursor: "pointer"
      }}
    >
      <div className="fc-event-main">
        <div>
          <strong>{item.name}</strong>
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
  const [apiRecipes, setApiRecipes] = useState([])
  const [calendar, updateCalendar] = useState([])
  const [ingredientNum, setIngredientNum] = useState(1)

  const [noEntriesInDatabaseFlag, setFlag] = useState(0)
  
  useEffect(()=>{
    axios
    .get('/api/recipes')
    .then(recipes => {
      console.log('THIS WAS HIT')
      recipes.data.recipes.map(recipe => recipe.title = recipe.name)
      setApiRecipes(recipes.data.recipes)
    })
    .catch(err => console.log(err))
  }, [calendar])

  useEffect(()=>{
    axios
    .get('/api/calendar')
    .then(calendarEntries => {
      console.log(calendarEntries, '???')
      if (!calendarEntries.data.calendarEntries.length) {
        setFlag(1)
      }
      for (let i=0; i<calendarEntries.data.calendarEntries.length; i++) {
        calendarEntries.data.calendarEntries[i].allDay = true;
        calendarEntries.data.calendarEntries[i].start = new Date(calendarEntries.data.calendarEntries[i]._date);
        calendarEntries.data.calendarEntries[i].name = calendarEntries.data.calendarEntries[i].title;
        // calendarEntries.data.calendarEntries[i]._id = calendarEntries.data.calendarEntries[i].id
      }
      updateCalendar(calendarEntries.data.calendarEntries)
    })
    .catch(err => console.log(err))
  }, [])

  // handle event receive
  const handleEventReceive = (eventInfo) => {

    const newEvent = {
      id: eventInfo.event._def.extendedProps._id,
      title: eventInfo.draggedEl.getAttribute("name"),
      name: eventInfo.draggedEl.getAttribute("name"),
      color: eventInfo.event._def.ui.backgroundColor,
      _date: eventInfo.event.start,
      _instance: eventInfo.event._instance.defId,
    };

    postToCalendarDB(newEvent)
    updateCalendar(previous=>[...previous, newEvent]);
  };

    // handle event move
    const handleEventMove = (e) => {
      const id = e.event._def.extendedProps._id

      let event
      const event = calendar.find(item => item._id === id)

      if (!event) {
        event = calendar.find(item => item.id === id)
      }

      event._date = e.event.start
      console.log(event, 'test implementation')

      updateCalendarDB(event, e)
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

  function postToCalendarDB(item) {
    axios
      .post('/api/calendar', {...item})
      .then(response => console.log(response, ' ? something response for calendar post?'))
      .catch(err=> console.log(err, ' an error with calendar post'))
  }

  function updateCalendarDB(item, e) {
    axios
    .put('/api/calendar', {...item})
    .then(response => console.log(response, ' ? something response for calendar post?'))
    .catch(err=> {console.log(err, ' an error with calendar post'); e.revert()})
  }

  function handleCheck(e) {
    if (e.target.checked) {
      setExpandedView(5)
    } else {
      setExpandedView(1)
    }
    setChecked(e.target.checked)
  }

  function getIngredients(id) {
    if (apiRecipes.length) {
      const recipe = apiRecipes.find(element => element._id === id)
      const recipeIngredients = recipe.ingredients
      const amountArr = recipe.amount
  
      return recipeIngredients.map((ingredient, i)=>` <span>${ingredient.name}${amountArr[i] ? (' (' + amountArr[i] + ')') : ''}</span>`)
    } else {
      alert('No recipes!')
    }
  }

  function eventClick(eventClick) {
    console.log(eventClick.event, 'send the correct id')
    Alert.fire({
      title: eventClick.event._def.extendedProps.name + '<div style="font-size: 20">' + eventClick.event.start.toString().slice(0, 15) + '</div>',
      html:
      `<div>` +
        getIngredients(eventClick.event._def.publicId ? eventClick.event._def.publicId : eventClick.event._def.extendedProps._id) +
      '</div>',

      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove",
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
      <div onClick={()=>console.log(calendar, 'calendar')} className="recipe-wrapper">
        <div className="recipe-title flex-center">
          <Link href="/items">
            <a className="link">Add Grocery Item</a>
          </Link>
        </div>
        <div id="all-recipes">
          {apiRecipes.map((item) => (
            <Recipe key={item.id} item={item} />
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

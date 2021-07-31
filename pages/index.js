import React, { useEffect, useState, useRef, memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Link from 'next/link'

import Alert from "sweetalert2";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";

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
        console.log('THIS WAS HIT')
        return { ...item, uuid: uuid_v4(), create: true };
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
  const [ingredients, setApiIngredients] = useState([])
  const [calendar, updateCalendar] = useState([])

  const [actualCalendar, updateActualCalendar] = useState([])
  const [ingredientNum, setIngredientNum] = useState(1)

  const [dbUpdatedFlag, setDbUpdatedFlag] = useState(0)
  const [dbChange, detectPostToDB] = useState(0)
  const [currentEvent, setCurrentEvent] = useState({})

  const [theEvent, setTheEvent] = useState({})
  
  useEffect(()=>{
    axios
    .get('/api/recipes')
    .then(recipes => {
      console.log('THIS WAS HIT')
      recipes.data.recipes.map(recipe => recipe.title = recipe.name)
      setApiRecipes(recipes.data.recipes)
    })
    .catch(err => console.log(err))

    axios
    .get('/api/ingredients')
    .then(ingredients => {
      console.log('THIS WAS HIT')
      recipes.data.recipes.map(recipe => recipe.title = recipe.name)
      setApiRecipes(recipes.data.recipes)
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(()=>{
    axios
    .get('/api/calendar')
    .then(calendarEntries => {
      console.log(calendarEntries, 'this was hit => CALENDAR ENTRIES')
      for (let i=0; i<calendarEntries.data.calendarEntries.length; i++) {
        if(!calendarEntries.data.calendarEntries[i]._id) { // do nothing} 
          console.log(calendarEntries.data.calendarEntries[i], 'what is here')
          // check if the instance has already occurred
        }
        calendarEntries.data.calendarEntries[i].start = new Date(calendarEntries.data.calendarEntries[i].start);
        // calendarEntries.data.calendarEntries[i]._id = calendarEntries.data.calendarEntries[i].id
      }
      updateCalendar([...calendarEntries.data.calendarEntries])
      updateActualCalendar([...calendarEntries.data.calendarEntries])
    })
    .catch(err => console.log(err))
  }, [])

  // handle event receive
  const handleEventReceive = (e) => {
    console.log(e, 'what is the recipe id?')
    // 
    const newEvent = {
      recipe_id: e.event._def.extendedProps._id,
      title: e.event._def.title,
      color: e.event._def.ui.backgroundColor,
      start: e.event.start,
      _instance: e.event._instance.defId,
      allDay: true
    };

    console.log(newEvent, 'what is the recipe id here?')

    postToCalendarDB(newEvent, e, e.event._def.extendedProps.uuid)
  };

    // handle event move
    const handleEventMove = (e) => {
      const event = findItem(e)

      event.start = e.event.start


      updateCalendarDB(event, e)

    };

  function postToCalendarDB(item, e, uuid) {
    axios
      .post('/api/calendar', {...item})
      .then(response => {
        updateActualCalendar(previous => [...previous, {...response.data.entry, uuid}])
      })
      .catch(err=> {
        e.revert();
        console.log(err, ' an error with calendar postasdashdjk')
      })
  }

  function updateCalendarDB(item, e) {
    axios
    .put('/api/calendar', {...item})
    .then(response => console.log(response, ' ? something response for calendar post?'))
    .catch(err=> {console.log(err, ' an error with calendar post'); e.revert()})
  }

  function deleteFromCalendarDB(itemId, e, callback) {
    axios
      .delete('/api/calendar', {params: {_id: itemId._id}})
      .then(res=>callback(true))
      .catch(err=>{console.log(err, ' an error with calendar post'); if (e) e.revert(); callback(false)})
  }

  function findItem(e) {
    // Either maps to item from db or item in the current state
    return calendar.find(item => item._id === e.event._def.extendedProps._id) || actualCalendar.find(item => item.uuid === e.event._def.extendedProps.uuid)
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
    const event = findItem(eventClick)
    console.log(event._id, 'what is event clicked??')

    function deleteCallback(success) {
      if (success) {
        Alert.fire("Deleted!", "Your item has been deleted.", "success");
      } else {
        Alert.fire("Oops!", "An network error occurred.", "failure");
      }
    }

    Alert.fire({
      title: eventClick.event._def.title + '<div style="font-size: 20">' + eventClick.event.start.toString().slice(0, 15) + '</div>',
      html:
      `<div>` +
        getIngredients(event.recipe_id) +
      '</div>',

      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.value) {
        const newArr = actualCalendar.filter(events => events._id !== event._id)
        updateActualCalendar(newArr)
        // IF event was just added on front end UI
        if (eventClick.event._def.extendedProps.uuid) {
          // utilize remove() function
          eventClick.event.remove(); // It will remove event from the calendar
          // if uuid exists, then this item has not been added to calendar arr, but is in actualCalendar arr
          // delete from db first
          deleteFromCalendarDB(event, eventClick, deleteCallback)

        } else {
          const calendarArr = calendar.filter(events => events._id !== event._id)
          updateCalendar(calendarArr)
          deleteFromCalendarDB(event, null, deleteCallback)
        }
      }
    });
  };

  return (
    <div className="App">
      <div onClick={()=>console.log(calendar, ' calendar', actualCalendar, ' actual')} className="recipe-wrapper">
        <div className="recipe-title flex-center">
          <Link href="/">
            <a className="link">Add Grocery Item</a>
          </Link>
        </div>
        <div id="all-recipes">
          {apiRecipes.map((item) => (
            <Recipe key={item._id} item={item} />
          ))}
        </div>
      </div>
      <div className="calendar-wrapper">
        <FullCalendar
        // style={{height: '50vh !important'}}
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
        <div style={{color: 'white'}}>Expanded View <input style={{marginTop: 20}} type="checkbox" defaultChecked={checked} onChange={e=>handleCheck(e)} />
      </div>
      <div><button onClick={()=>console.log(calendar, 'heres the state for u')}>Login</button></div>
      </div>
    </div>
  );
}

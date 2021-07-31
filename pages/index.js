import React, { useEffect, useState, useRef, memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Link from 'next/link'

import Alert from "sweetalert2";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";

// Test work flow

// first step is to see if post is working properly
// post is working fine.

// issue: post is happening multiple times
// issue: there are duplicates on front end and in db

// check: how many calls to db I'm making via post
// only one call, in one function, however that function is being called in a useEffect that is listening to something else
// the use effect is listening to dbChange

// deleted use Effect

// fixed the code so only one post was getting added to db on drop, however, the front end still displays two.

// When I repull data from db and replace calendar, full calendar refuses to update completely to the arr.
// Because of this ^, I will use an alternative arr that reflects the correct db - this should be okay because
// when I post to db, the new arr will refresh, and if it doesn't post, then I will use the revert function

// success. function now edits the correct db obj on move

// issue from mapping ingredients again due to db changes
// fixed issue using a helper function to find which event i'm trying to address for the db

// implement delete from db now

// When I delete, I will also have to filter both the calendars

// if uuid exist, remove the item from actual calendar arr using uuid.
// if uuid doesn't exist remove from both calendars using id


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
          console.log(event, 'HELLO EVENT?')
          deleteFromCalendarDB(event, eventClick, deleteCallback)

        } else {
          const calendarArr = calendar.filter(events => events._id !== event._id)
          updateCalendar(calendarArr)
          console.log(event, 'what we got here')
        }
      }
    });
  };

  return (
    <div className="App">
      <div onClick={()=>console.log(calendar, ' calendar', actualCalendar, ' actual')} className="recipe-wrapper">
        <div className="recipe-title flex-center">
          <Link href="/items">
            <a className="link">Add Grocery Item</a>
          </Link>
          <h1>Test</h1>
        </div>
        <div id="all-recipes">
          {apiRecipes.map((item) => (
            <Recipe key={item._id} item={item} />
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
        <div style={{color: 'white'}}>Expanded View <input style={{marginTop: 20}} type="checkbox" defaultChecked={checked} onChange={e=>handleCheck(e)} />
      </div>
      <div><button onClick={()=>console.log(calendar, 'heres the state for u')}>Login</button></div>
      </div>
    </div>
  );
}

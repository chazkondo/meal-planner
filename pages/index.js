import React, { useEffect, useState, useRef, memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Link from 'next/link'

import Alert from "sweetalert2";
import axios from "axios";

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
  
  useEffect(()=>{
    axios
    .get('/api/recipes')
    .then(recipes => {
      console.log(recipes.data.recipes, 'here')
      setApiRecipes(recipes.data.recipes)
    })
    .catch(err => console.log(err))
  }, [])

  // add external events
  const addRecipe = () => {
    let myresult;
    // axios call- if good show
    Alert.fire({
      title: 'Recipe FORM Form',
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Recipe Name">
        <input type="color" id="color" value="ffffff">
      `,
      confirmButtonText: 'Submit',
      focusConfirm: false,
      preConfirm: () => {
        const name = Alert.getPopup().querySelector('#name').value
        const color = Alert.getPopup().querySelector('#color').value
        if (!name || !color) {
          Alert.showValidationMessage(`Please enter name and color`)
        }
        return { name: name, color: color }
      }
    }).then((result) => {
      myresult = result;
      addIngredient(true)
    })

  };

  // Recursive function
  function addIngredient(bool, increment) {
    let num = 1;
    if (increment) {
      num = num + increment
    }
    if (bool) {
      Alert.fire({
        title: 'Ingredient #' + num,
        html: `
          <input type="text" id="name" class="swal2-input" placeholder="Ingredient">
          <div>
            Check box if adding another ingredient.
            <input type="checkbox" id="checkbox" class="swal2-input">
          </div>
        `,
        confirmButtonText: 'Submit',
        focusConfirm: false,
        preConfirm: () => {
          const name = Alert.getPopup().querySelector('#name').value
          const checkbox = Alert.getPopup().querySelector('#checkbox').checked
          if (!name) {
            Alert.showValidationMessage(`Please enter name`)
          }
          return { name: name, checkbox: checkbox }
        }
      })
      .then(result =>{
        addIngredient(result.value.checkbox, num)
      })
    } else {
      alert('ELSE WAS HIT')
    }
  }

  // handle event receive
  const handleEventReceive = (eventInfo) => {
    console.log(eventInfo.draggedEl.getAttribute("name"), 'hello?')
    const newEvent = {
      id: eventInfo.draggedEl.getAttribute("data-id"),
      name: eventInfo.draggedEl.getAttribute("name"),
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

  function getIngredients(id) {
    if (apiRecipes.length) {
      const recipe = apiRecipes.find(element=>element._id === id)
      const recipeIngredients = recipe.ingredients
      const amountArr = recipe.amount
  
      return recipeIngredients.map((ingredient, i)=>` <span>${ingredient.name}${amountArr[i] ? (' (' + amountArr[i] + ')') : ''}</span>`)
    } else {
      alert('No recipes!')
    }
  }

  function addIngredientInput(num) {
    num = num + 1;

    return `<input type="text" id="name" class="swal2-input" placeholder="Ingredient">`
  }

  function eventClick(eventClick) {
    console.log(eventClick, ' wait what is here!?!')
    Alert.fire({
      title: eventClick.event._def.extendedProps.name + '<div style="font-size: 20">' + eventClick.event.start.toString().slice(0, 15) + '</div>',
      html:
      `<div>` +
        getIngredients(eventClick.event._def.extendedProps._id) +
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

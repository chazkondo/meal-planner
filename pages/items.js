import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from '../styles/item.module.css'
import { useRouter } from 'next/router'
import Alert from "sweetalert2";

// Add modals for each function

// ie. if adding/editings item, then provide a modal for that
// keep the ui simple by asking if the user wants to add/edit items, or simply adjust recipes

// also plan for functionality of being able to drag and drop non food items to calendar as well.

export default function Items() {
  const router = useRouter()
  const ingredientTypes = ['Beverages – coffee/tea, juice, soda',
    'Bread/Bakery – sandwich loaves, dinner rolls, tortillas, bagels',
    'Canned/Jarred Goods – vegetables, spaghetti sauce, ketchup',
    'Dairy – cheeses, eggs, milk, yogurt, butter',
    'Dry/Baking Goods – cereals, flour, sugar, pasta, mixes',
    'Frozen Foods – waffles, vegetables, individual meals, ice cream',
    'Meat – lunch meat, poultry, beef, pork',
    'Produce – fruits, vegetables',
    'Cleaners – all- purpose, laundry detergent, dishwashing liquid/detergent',
    'Paper Goods – paper towels, toilet paper, aluminum foil, sandwich bags',
    'Personal Care – shampoo, soap, hand soap, shaving cream',
    'Other' ]
  const condensedTypes = ['Beverages', 'Bread/Bakery', 'Canned/Jarred Goods', 'Dairy', 'Dry/Baking Goods', 'Frozen Foods', 'Meat', 'Produce', 'Cleaners', 'Paper Goods', 'Personal Care', 'Other']
  const [name, setName] = useState('')
  const [type, setType] = useState(0)
  const [allIngredients, setAllIngredients] = useState([])
  const [navigationBlocker, setNavigationBlocker] = useState(false)





  useEffect(()=>{
    axios
      .get('/api/ingredients')
      .then(ingredients => {
        setAllIngredients(ingredients.data.ingredients)
      })
      .catch(err => console.log(err))
  },[])

  useEffect(()=>{
    if (navigationBlocker) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
}, [navigationBlocker])



  function postItem() {
    setNavigationBlocker(true)
    if (type > 7) {
      axios
        .post('/api/items/', {
          name,
          type: condensedTypes[type]
        })
        .then(res=>{
          setNavigationBlocker(false)
          Alert.fire({
            title: eventClick.event._def.title + '<div style="font-size: 20">' + eventClick.event.start.toString().slice(0, 15) + '</div>',
            html: isRecipe ? 
            `<div>` +
              getIngredients(event.recipe_id) +
            '</div>' : null,
      
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
        })
        .catch(err=>console.log(err, 'wat err?'))
    } else {
      axios
        .post('/api/ingredients/', {
          name,
          type: condensedTypes[type]
        })
        .then(res=>{
          setNavigationBlocker(true)
          Alert.fire({
            title: eventClick.event._def.title + '<div style="font-size: 20">' + eventClick.event.start.toString().slice(0, 15) + '</div>',
            html: isRecipe ? 
            `<div>` +
              getIngredients(event.recipe_id) +
            '</div>' : null,
      
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
        })
        .catch(err=>console.log(err, 'wat err?'))
    }
    
  }

  function setDropdownValue(e) {
    setType(e.target.value)
  }


  return (
    <div className={styles.itemWrapper}>
        Add Item
        <br />
        <input type="text" placeholder={'Enter Item Name'} onChange={(e) => setName(e.target.value)} value={name}  />
        <br />
        <label htmlFor="items">Choose an item type:</label>
        <select id="items" name="items" onChange={(e) => setDropdownValue(e)} value={type}>
          {ingredientTypes.map((item, i) => <option value={i} key={i}>{item}</option>)}
        </select>
        <br />
        <button onClick={()=>postItem()}>Submit</button>
    </div>
  );
}  

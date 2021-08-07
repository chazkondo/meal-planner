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
  const [navigationBlocker, setNavigationBlocker] = useState(false)

  useEffect(()=>{
    if (navigationBlocker) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
}, [navigationBlocker])


  function toggleAddMoreAlert(){
    setNavigationBlocker(false)
    Alert.fire({
      title: 'Successfully Added.',
      html: `<div>` +
       'Add another item?' +
      '</div>',

      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (!result.value) {
          router.push('/')
        } else {
          // do nothing
        }
    });
  }


  function postItem() {
    if (!name.length) {
      return alert('Please type in a name')
    }
    setNavigationBlocker(true)
    if (type > 7) {
      axios
        .post('/api/items/', {
          name,
          type: condensedTypes[type]
        })
        .then(()=>{
          toggleAddMoreAlert()
        })
        .catch(err=>{
          setNavigationBlocker(false)
          alert('Oops a network error occurred.')
        })
    } else {
      axios
        .post('/api/ingredients/', {
          name,
          type: condensedTypes[type]
        })
        .then(()=>{
          toggleAddMoreAlert()
        })
        .catch(err=>{
          setNavigationBlocker(false)
          alert('Oops a network error occurred.')
        })
    }
    
  }

  function setDropdownValue(e) {
    setType(e.target.value)
  }


  return (
    <div className={styles.itemWrapper}>
      <div style={{ width: '15vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        Add Item <span style={{color: 'blue', cursor: 'pointer', fontSize: 12}} onClick={()=>router.push('items')}>[ All Items ]</span>
        </div>
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

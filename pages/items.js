import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

export default function Items() {
  const types = ['Beverages – coffee/tea, juice, soda',
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
  const [type, setType] = useState(types[0])

  function doACall() {
    // axios
    //   .get(`/api/items`)
    //   .then(result=>console.log(result, 'result wat?'))
    //   .catch(err=>console.log(err, 'wat err'))
    alert('fired')
  }

  function postItem() {
    alert('sup')

    if (type > 7) {
      axios
        .post('/api/items/', {
          name,
          type: condensedTypes[type]
        })
        .then(res=>console.log(res, 'wat?'))
        .catch(err=>console.log(err, 'wat err?'))
    } else {
      axios
        .post('/api/ingredients/', {
          name,
          type: condensedTypes[type]
        })
        .then(res=>console.log(res, 'wat?'))
        .catch(err=>console.log(err, 'wat err?'))
    }
  }

  function setItemValue(e) {
    setName(e)
  }

  function setDropdownValue(e) {
    setType(e.target.value)
  }

  return (
    <div>
        Add Item
        <br />
        <input type="text" placeholder={'Enter Item Name'} onChange={(e) => setItemValue(e.target.value)} value={name}  />
        <br />
        <label htmlFor="items">Choose a type:</label>
        <select id="items" name="items" onChange={(e) => setDropdownValue(e)} value={type}>
          {types.map((item, i) => <option value={i} key={i}>{item}</option>)}
        </select>
        <button onClick={()=>postItem()}>Submit</button>
    </div>
  );
}

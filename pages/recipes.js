import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

export default function Ingredients() {
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
  const condensedTypes = []
  const [name, setName] = useState('')
  const [type, setType] = useState(arr[0])

  function doACall() {
    // axios
    //   .get(`/api/ingredients`)
    //   .then(result=>console.log(result, 'result wat?'))
    //   .catch(err=>console.log(err, 'wat err'))
    alert('fired')
  }

  function postIngredient() {
    alert('sup')
    axios
      .post('/api/ingredients/', {
        name,
        type
      })
      .then(res=>console.log(res, 'wat?'))
      .catch(err=>console.log(err, 'wat err?'))
  }

  function setIngredientValue(e) {
    setName(e)
  }

  function setDropdownValue(e) {
    setType(e)
  }

  return (
    <div>
        Add Ingredient
        <br />
        <input type="text" placeholder={'Enter Ingredient Name'} onChange={(e) => setIngredientValue(e.target.value)} value={name}  />
        <br />
        <label htmlFor="ingredients">Choose a type:</label>
        <select id="ingredients" name="ingredients" onChange={(e) => setDropdownValue(e.target.value)} value={type}>
          {arr.map((item, i) => <option value={item} key={i}>{item}</option>)}
        </select>
        <button onClick={()=>postIngredient()}>Submit</button>
    </div>
  );
}

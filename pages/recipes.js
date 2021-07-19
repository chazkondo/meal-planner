import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

export default function Ingredients() {
  const [name, setName] = useState('')
  const [dropdown, setDropdown] = useState('')

  const arr = ['poop', 'dook', 'shook', 'jook']

  function doACall() {
    // axios
    //   .get(`/api/ingredients`)
    //   .then(result=>console.log(result, 'result wat?'))
    //   .catch(err=>console.log(err, 'wat err'))
    alert('fired')
  }

  function postIngredient() {
    axios
      .post('/api/ingredients', {
        name,
        dropdown
      })
      .then(res=>console.log(res, 'wat?'))
      .catch(err=>console.log(err, 'wat err?'))
  }

  function setIngredientValue(e) {
    setName(e)
  }

  function setDropdownValue(e) {
    setDropdown(e)
  }

  return (
    <div>
        Add Ingredient
        <br />
        <input type="text" placeholder={'Enter Ingredient Name'} onChange={(e) => setIngredientValue(e.target.value)} value={name}  />
        <br />
        <label for="cars">Choose a car:</label>
        <select id="cars" name="cars" onChange={(e) => setDropdownValue(e.target.value)} value={dropdown}>
          {arr.map((item, i) => <option value={item} key={i}>{item}</option>)}
        </select>
        <button onClick={()=>postIngredient()}>Submit</button>
    </div>
  );
}

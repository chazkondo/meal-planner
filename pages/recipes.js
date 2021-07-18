import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

export default function Ingredients() {
  const [name, setName] = useState('')

  function doACall() {
    // axios
    //   .get(`/api/ingredients`)
    //   .then(result=>console.log(result, 'result wat?'))
    //   .catch(err=>console.log(err, 'wat err'))
    alert('fired')
  }

  function setIngredientValue(e) {
    setName(e)
  }

  return (
    <div>
        Add Ingredient
        <br />
        <input type="text" placeholder={'Enter Ingredient Name'} onChange={(e) => setIngredientValue(e.target.value)} value={name}  />
        <label for="cars">Choose a car:</label>
        <select id="cars" name="cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="fiat">Fiat</option>
          <option value="audi">Audi</option>
        </select>
        <button onClick={()=>doACall()}>Submit</button>
    </div>
  );
}

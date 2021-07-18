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
        <button onClick={()=>doACall()}>Submit</button>
    </div>
  );
}

import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

export default function Ingredients() {

  function doACall() {
    axios
      .get(`/api/ingredients`)
      .then(result=>console.log(result, 'result wat?'))
      .catch(err=>console.log(err, 'wat err'))
  }

  function setIngredientValue() {
    
  }

  return (
    <div onClick={()=>doACall()} >
        Add Ingredient
        <input type="text" placeholder={'Enter Ingredient Name'} onChange={(e) => setIngredientValue(e.target.value)} value={'hi'}  />
    </div>
  );
}

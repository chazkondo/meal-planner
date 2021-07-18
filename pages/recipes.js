import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

export default function Ingredients() {

  function doACall() {
    axios
      .get(`/api/ingredients`)
      .then(result=>console.log(result, 'result wat?'))
      .catch(err=>console.log(err, 'wat err'))
  }

  return (
    <div onClick={()=>doACall()} className="Recipes">
        POOP
    </div>
  );
}

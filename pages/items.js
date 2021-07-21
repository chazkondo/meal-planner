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
  const [ingredientName, setIngredientName] = useState('')
  const [type, setType] = useState(types[0])
  const [currentRecipe, setCurrentRecipe] = useState([])
  const [allIngredients, setAllIngredients] = useState([])
  const [ingredientIndex, setIngredientIndex] = useState(0)
  const [allRecipes, setAllRecipes] = useState([])

  const [currentAmountDiv, setCurrentAmountDiv] = useState(null)



  useEffect(()=>{
    axios
      .get('/api/ingredients')
      .then(ingredients => {
        setAllIngredients(ingredients.data.ingredients)
      })
      .catch(err => console.log(err))
  },[])

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

  function setIngredientValue(e) {
    setIngredientName(e)
  }

  function setDropdownValue(e) {
    setType(e.target.value)
  }

  function setIngredientDropdownValue(e) {
    setIngredientIndex(e.target.value)
  }

  function addIngredient() {
    setCurrentRecipe(previous => [...previous, allIngredients[ingredientIndex]]);
  }

  function findCurrentRecipeIndex(index) {
    // let change = currentRecipe[index];
    // change.toggleDiv = true;
    // showAmountDiv(change, index)
    setCurrentAmountDiv(index)
  }

  function showAmountDiv(el, index) {
    // let copy = currentRecipe.slice();
    // copy[index] = el;
    // setCurrentRecipe(copy)
    // copy = undefined;
  }

  function hideAmountDiv(index) {
    // let copy = currentRecipe.slice();
    // copy[index].toggleDiv = undefined;
    // setCurrentRecipe(copy)
    // copy = undefined;
  }

  return (
    <div>
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
    <br />
    <br />
    <div>
        Add/Edit Recipe <select id="recipe" name="recipe" onChange={(e) => setIngredientDropdownValue(e)} value={currentRecipe}>
          {allRecipes.map((item, i) => <option value={i} key={i}>{item.name}</option>)}
        </select>
        <br />
        {currentRecipe.map((recipeItem, mappedIndex) => 
          <div>
            {recipeItem.name}
            {console.log(mappedIndex, 'wtf is this?')}
          {currentAmountDiv === mappedIndex ? <div><input type="text" placeholder={'Enter Amount'} onChange={(e) => console.log(e)} value={name}  /><button onClick={() => hideAmountDiv(mappedIndex)}>Submit</button></div> : <button onClick={()=>findCurrentRecipeIndex(mappedIndex)}>Add Amount</button>}
          </div>
        )}
        <label htmlFor="ingredients">Choose an ingredient:</label>
        <select id="ingredients" name="ingredients" onChange={(e) => setIngredientDropdownValue(e)} value={ingredientIndex}>
          {allIngredients.map((item, i) => <option value={i} key={i}>{item.name}</option>)}
        </select>
        <button onClick={()=>addIngredient()}>Add Ingredient</button>
    </div>
    <button onClick={()=>console.log(currentRecipe)} disabled={!currentRecipe.length}>Submit Recipe</button>
    </div>
  );
}

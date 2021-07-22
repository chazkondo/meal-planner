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
  const [currentAmount, setCurrentAmount] = useState('')

  const [color, setColor] = useState("#e66465");

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
    setCurrentAmount('')
    setCurrentAmountDiv(index)
  }

  function submitAmount(index) {
    let copy = currentRecipe.slice();
    copy[index] = {...copy[index], amount: currentAmount};
    setCurrentRecipe(copy)
    copy = undefined;
    console.log(index)
    setCurrentAmount('')
    setCurrentAmountDiv(null)
  }

  function submitIngredient() {
    axios
      .post('/api/recipes', {
        ...currentRecipe
      })
      .then(result=>console.log(result, 'hit recipe switch'))
      .catch(err => console.log(err, 'an error occ. recipe switch'))
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
          {currentAmountDiv === mappedIndex ? <div><input type="text" placeholder={'Enter Amount'} onChange={(e) => setCurrentAmount(e.target.value)} value={currentAmount}  /><button onClick={() => submitAmount(mappedIndex)}>Submit</button></div> : <button onClick={()=>findCurrentRecipeIndex(mappedIndex)}>Add Amount</button>}
          </div>
        )}
        <label htmlFor="ingredients">{allIngredients.length ? 'Choose an ingredient:' : 'Loading'}</label>
        <select id="ingredients" name="ingredients" onChange={(e) => setIngredientDropdownValue(e)} value={ingredientIndex}>
          {allIngredients.map((item, i) => <option value={i} key={i}>{item.name}</option>)}
        </select>
        <button onClick={()=>addIngredient()}>Add Ingredient</button>
    </div>
    <label for="color">Color</label>
    <input type="color" id="color" name="color" value={color} onChange={e => setColor(e.target.value)}/>
    <br />
    <br />
    <button onClick={()=>{console.log(currentRecipe); submitIngredient()}} disabled={!currentRecipe.length}>Submit Recipe</button>
    </div>
  );
}

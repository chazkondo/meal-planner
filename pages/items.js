import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

// Add modals for each function

// ie. if adding/editings item, then provide a modal for that
// keep the ui simple by asking if the user wants to add/edit items, or simply adjust recipes

// also plan for functionality of being able to drag and drop non food items to calendar as well.

export default function Items() {
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
  const recipeTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Appetizer', 'Drink']
  const condensedTypes = ['Beverages', 'Bread/Bakery', 'Canned/Jarred Goods', 'Dairy', 'Dry/Baking Goods', 'Frozen Foods', 'Meat', 'Produce', 'Cleaners', 'Paper Goods', 'Personal Care', 'Other']
  const [name, setName] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [ingredientName, setIngredientName] = useState('')
  const [type, setType] = useState(0)
  const [currentRecipeIngredients, setCurrentRecipeIngredients] = useState([])
  const [currentRecipe, setCurrentRecipe] = useState({})
  const [allIngredients, setAllIngredients] = useState([])
  const [ingredientIndex, setIngredientIndex] = useState(0)
  const [allRecipes, setAllRecipes] = useState([])
  const [recipeDropdown, setRecipeDropdown] = useState(0)
  const [recipeServings, setRecipeServings] = useState(0)

  const [isPrep, setIsPrep] = useState(false)

  const [currentAmountDiv, setCurrentAmountDiv] = useState(null)
  const [currentAmount, setCurrentAmount] = useState('')

  const [recipeDropdownState, setRecipeDropdownState] = useState(0)

  const [color, setColor] = useState("#e66465");

  useEffect(()=>{
    axios
      .get('/api/ingredients')
      .then(ingredients => {
        setAllIngredients(ingredients.data.ingredients)
      })
      .catch(err => console.log(err))
  },[])

  useEffect(()=>{
    axios
      .get('/api/recipes')
      .then(recipes => {
        console.log(recipes.data.recipes, 'here')
        setAllRecipes(recipes.data.recipes)
      })
      .catch(err => console.log(err))
  },[])


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

  function setDropdownValue(e) {
    setType(e.target.value)
  }

  function setIngredientDropdownValue(e) {
    setIngredientIndex(e.target.value)
  }

  function addIngredient() {
    setCurrentRecipeIngredients(previous => [...previous, allIngredients[ingredientIndex]]);
  }

  function findCurrentRecipeIndex(index) {
    // let change = currentRecipe[index];
    // change.toggleDiv = true;
    setCurrentAmount('')
    setCurrentAmountDiv(index)
  }

  function submitAmount(index) {
    let copy = currentRecipeIngredients.slice();
    copy[index] = {...copy[index], amount: currentAmount};
    setCurrentRecipeIngredients(copy)
    copy = undefined;
    console.log(index)
    setCurrentAmount('')
    setCurrentAmountDiv(null)
  }

  function submitIngredient() {
    axios
      .post('/api/recipes', {
        name: recipeName,
        type: recipeTypes[recipeDropdown],
        servings: recipeServings, 
        ingredients: currentRecipeIngredients,
        isPrepRecipe: isPrep,
        color,
      })
      .then(result=>console.log(result, 'hit recipe switch'))
      .catch(err => console.log(err, 'an error occ. recipe switch'))
  }

  return (
    <div>
    <div>
        Add Item
        <br />
        <input type="text" placeholder={'Enter Item Name'} onChange={(e) => setName(e.target.value)} value={name}  />
        <br />
        <label htmlFor="items">Choose an item type:</label>
        <select id="items" name="items" onChange={(e) => setDropdownValue(e)} value={type}>
          {ingredientTypes.map((item, i) => <option value={i} key={i}>{item}</option>)}
        </select>
        <button onClick={()=>postItem()}>Submit</button>
    </div>
    <br />
    <br />
    <div>
        Add Recipe 
        {/* {allRecipes.length ? <select id="recipe" name="recipe" onChange={(e) => setRecipeDropdownState(e.target.value)} value={recipeDropdownState}>
          {allRecipes.map((item, i) => <option value={i} key={i}>{item.name}</option>)}
        </select> : null} */}
        <br />
        <input type="text" placeholder={'Enter Recipe Name'} onChange={(e) => setRecipeName(e.target.value)} value={recipeName}  />
        <br />
        <label htmlFor="recipes">Choose a recipe type:</label>
        <select id="recipes" name="recipes" onChange={(e) => setRecipeDropdown(e.target.value)} value={recipeDropdown}>
          {recipeTypes.map((item, i) => <option value={i} key={i}>{item}</option>)}
        </select>
    </div>
    </div>
  );
}

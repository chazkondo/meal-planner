import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

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
        ingredients: currentRecipeIngredients
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
        Add/Edit Recipe <select multiple={true} id="recipe" name="recipe" onChange={(e) => setIngredientDropdownValue(e)} value={currentRecipeIngredients}>
          {allRecipes.map((item, i) => <option value={i} key={i}>{item.name}</option>)}
        </select>
        <br />
        <input type="text" placeholder={'Enter Recipe Name'} onChange={(e) => setRecipeName(e.target.value)} value={recipeName}  />
        <br />
        <label htmlFor="recipes">Choose a recipe type:</label>
        <select id="recipes" name="recipes" onChange={(e) => setRecipeDropdown(e.target.value)} value={recipeDropdown}>
          {recipeTypes.map((item, i) => <option value={i} key={i}>{item}</option>)}
        </select>
        <br />
        <br />
        <label htmlFor="servings">(Optional) Servings:</label>
        <input type="number" placeholder={'Enter Amount of Servings'} onChange={(e) => setRecipeName(e.target.value)} value={recipeName}  />
        <br />
        {currentRecipeIngredients.map((recipeItem, mappedIndex) => 
          <ul>
            <li key={mappedIndex}>
              {recipeItem.name}
            {currentAmountDiv === mappedIndex ? <div><input type="text" placeholder={'Enter Amount'} onChange={(e) => setCurrentAmount(e.target.value)} value={currentAmount}  /><button onClick={() => submitAmount(mappedIndex)}>Submit</button></div> : <button onClick={()=>findCurrentRecipeIndex(mappedIndex)}>{recipeItem.amount ? 'Edit Amount' : 'Add Amount'}</button>}
            {recipeItem.amount ? <div>[ {recipeItem.amount} ]</div> : null}
            <br />
            </li>
          </ul>
        )}
        <label htmlFor="ingredients">{allIngredients.length ? 'Choose an ingredient to add:' : 'Loading'}</label>
        <select id="ingredients" name="ingredients" onChange={(e) => setIngredientDropdownValue(e)} value={ingredientIndex}>
          {allIngredients.map((item, i) => <option value={i} key={i}>{item.name}</option>)}
        </select>
        <button onClick={()=>addIngredient()}>Add Ingredient</button>
    </div>
    <label htmlFor="color">Color</label>
    <input type="color" id="color" name="color" value={color} onChange={e => setColor(e.target.value)}/>
    <br />
    <br />
    <button onClick={()=>{console.log(currentRecipeIngredients); submitIngredient()}} disabled={!currentRecipeIngredients.length}>Submit Recipe</button>
    </div>
  );
}

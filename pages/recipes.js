import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";

// Add modals for each function

// ie. if adding/editings item, then provide a modal for that
// keep the ui simple by asking if the user wants to add/edit items, or simply adjust recipes

// also plan for functionality of being able to drag and drop non food items to calendar as well.

export default function Items() {
  const recipeTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Appetizer', 'Drink']
  const condensedTypes = ['Beverages', 'Bread/Bakery', 'Canned/Jarred Goods', 'Dairy', 'Dry/Baking Goods', 'Frozen Foods', 'Meat', 'Produce', 'Cleaners', 'Paper Goods', 'Personal Care', 'Other']
  const [name, setName] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [type, setType] = useState(0)
  const [currentRecipeIngredients, setCurrentRecipeIngredients] = useState([])
  const [allIngredients, setAllIngredients] = useState([])
  const [ingredientIndex, setIngredientIndex] = useState(0)
  const [allRecipes, setAllRecipes] = useState([])
  const [recipeDropdown, setRecipeDropdown] = useState(0)
  const [recipeServings, setRecipeServings] = useState(0)

  const [isPrep, setIsPrep] = useState(false)

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
    <div className="recipe-wrapper">
    <div>
        Add Recipe 
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
        <input type="number" placeholder={'Enter Amount of Servings'} onChange={(e) => setRecipeServings(e.target.value)} value={recipeServings}  />
        <br />
        <br />
        <label htmlFor="prep">(Optional) Prep Recipe</label>
        <input type="checkbox" name="prep" value="prep" onChange={()=>setIsPrep(previous=>!previous)} checked={isPrep}/>
        <br />
        <br />
        <ul>
        {currentRecipeIngredients.map((recipeItem, mappedIndex) => 
            <li key={mappedIndex}>
              {recipeItem.name}
            {currentAmountDiv === mappedIndex ? <div key={`${mappedIndex} + '_amount_div'`}><input type="text" placeholder={'Enter Amount'} onChange={(e) => setCurrentAmount(e.target.value)} value={currentAmount}  /><button onClick={() => submitAmount(mappedIndex)}>Submit</button></div> : <button onClick={()=>findCurrentRecipeIndex(mappedIndex)}>{recipeItem.amount ? 'Edit Amount' : 'Add Amount'}</button>}
            {recipeItem.amount ? <div key={`${mappedIndex} + 'set_amount_div'`}>[ {recipeItem.amount} ]</div> : null}
            <br />
            <br />
            </li>
        )}
        </ul>
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

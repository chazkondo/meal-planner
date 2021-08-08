import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Alert from "sweetalert2";

// Add modals for each function

// ie. if adding/editings item, then provide a modal for that
// keep the ui simple by asking if the user wants to add/edit items, or simply adjust recipes

// also plan for functionality of being able to drag and drop non food items to calendar as well.

export default function Items() {
  const router = useRouter()
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
  const condensedTypes = ['Beverages', 'Bread/Bakery', 'Canned/Jarred Goods', 'Dairy', 'Dry/Baking Goods', 'Frozen Foods', 'Meat', 'Produce', 'Cleaners', 'Paper Goods', 'Personal Care', 'Other']
  const [name, setName] = useState('')
  const [type, setType] = useState(0)
  const [allItems, setAllItems] = useState([])
  const [navigationBlocker, setNavigationBlocker] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allRecipes, setAllRecipes] = useState([])
  const [recipeMap, setRecipeMap] = useState([])



  useEffect(()=>{
    axios
    .get('/api/recipes')
    .then(recipes => {
      console.log(recipes.data.recipes, 'here')
      mapRecipeArrays(recipes.data.recipes)
      setAllRecipes(recipes.data.recipes)
    })
    .catch(err => console.log(err))

    axios
      .get('/api/groceryitems')
      .then(items => {
          console.log(items.data.groceryItems, 'anything weird?')
        setAllItems(items.data.groceryItems)
        setLoading(false)
      })
      .catch(err => {console.log(err); setLoading(false)})
  },[])

  useEffect(()=>{
    if (navigationBlocker) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
}, [navigationBlocker])

function mapRecipeArrays(arr) {
    const obj = []
    arr.forEach(item => obj[item._id] = [...item.ingredients])
    return setRecipeMap(obj)
}


  function toggleEditAlert(){
    setNavigationBlocker(false)
    Alert.fire({
      title: 'Successfully Added.',
      html: `<div>` +
       'Add another item?' +
      '</div>',

      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (!result.value) {
          router.push('/')
        } else {
          // do nothing
        }
    });
  }


  function postItem() {
    setNavigationBlocker(true)
    if (type > 7) {
      axios
        .post('/api/items/', {
          name,
          type: condensedTypes[type]
        })
        .then(()=>{
          toggleAddMoreAlert()
        })
        .catch(err=>{
          setNavigationBlocker(false)
          alert('Oops a network error occurred.')
        })
    } else {
      axios
        .post('/api/ingredients/', {
          name,
          type: condensedTypes[type]
        })
        .then(()=>{
          toggleAddMoreAlert()
        })
        .catch(err=>{
          setNavigationBlocker(false)
          alert('Oops a network error occurred.')
        })
    }
    
  }

  function axiosDeleteItem(item) {
    setNavigationBlocker(true)
    axios
    .delete('/api/items/', {params: {...item}})
    .then(res=>{
        if (res.data.success) {
            filterOutItem(item)
        } else {
            alert('Oops. An error occurred.')
        }
        setNavigationBlocker(false)
    })
    .catch(err=>{
      setNavigationBlocker(false)
      alert('Oops a network error occurred.')
    })
  }

  function axiosDeleteIngredient(item) {
    setNavigationBlocker(true)
    axios
    .delete('/api/ingredients/', {params: {...item}})
    .then(res=>{
        if (res.data.success) {
            filterOutItem(item)
        } else {
            alert('Oops. An error occurred.')
        }
        setNavigationBlocker(false)
    })
    .catch(err=>{
      setNavigationBlocker(false)
      alert('Oops a network error occurred.')
    })
  }

  function axiosPatchItem(item) {
    setNavigationBlocker(true)
    axios
    .patch('/api/items/', {...item})
    .then(res=>{
        if (res.data.success) {
            alert('Successful Edit')
        } else {
            alert('Oops. An error occurred.')
        }
        setNavigationBlocker(false)
    })
    .catch(err=>{
      setNavigationBlocker(false)
      alert('Oops a network error occurred.')
    })
  }

  function axiosPatchIngredient(item) {
    setNavigationBlocker(true)
    axios
    .patch('/api/ingredients/', {...item})
    .then(res=>{
        if (res.data.success) {
            alert('Successful Edit')
        } else {
            alert('Oops. An error occurred.')
        }
        setNavigationBlocker(false)
    })
    .catch(err=>{
      setNavigationBlocker(false)
      alert('Oops a network error occurred.')
    })
  }

  function filterOutItem(item) {
      let filter = allItems.filter(arrItem => arrItem._id !== item._id)
      return setAllItems(filter)
  }

  function setDropdownValue(e) {
    setType(e.target.value)
  }

  function sanity (item) {
      console.log(item, 'what is her?')
    Alert.fire({
      title: item.name,
      html: `<span>Grocery Item</span><br /><br /><span>${item.type}</span>`,

      showDenyButton: true,
      confirmButtonColor: "blue",
      denyButtonColor: "red",
      confirmButtonText: "Edit",
      denyButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        edit(item)
      }
      if (result.isDenied) {
        if (confirm('Warning! Deleting items could affect your recipes and calendar. Do you want to proceed?')) {
            deleteItem(item)
        }
      }
    })
  }

  function edit (item) {
    Alert.fire({
        title: item.name,
        html: 
            `<span>${item.type}</span><br /><br /><input id="edit_name" type="text" placeholder="new name" pattern="[a-zA-Z0-9]+"/><br /><select id="edit_type" name="items">${condensedTypes.map((item, i) => '<option>'+item+'</option>')}
          </select>`
        ,
  
        showDenyButton: true,
        confirmButtonColor: "blue",
        denyButtonColor: "red",
        confirmButtonText: "Update",
        denyButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
            editItem(item)
            if (!document.getElementById('edit_name').value) {
                alert(item.name + document.getElementById('edit_type').value)
            } else {
                alert(document.getElementById('edit_name').value)
            }
        }
      })
  }

  function deleteItem(item) {
    if (condensedTypes.indexOf(item.type) < 0 || condensedTypes.indexOf(item.type) > 11) {
        return (alert('Error. Item not found.'))
    } else {
        if (condensedTypes.indexOf(item.type) > 7) {
            axiosDeleteItem(item)
        } else {
            axiosDeleteIngredient(item)
        }
    }
    console.log(condensedTypes.indexOf(item.type), ' this should be a num!')
  }

  function editItem(item) {
    if (condensedTypes.indexOf(item.type) <= 7) {
        findAffectedRecipes(item)
        // axiosPatchIngredient(item)
    } else {
        // axiosPatchItem(item)
    }
  }

  function findAffectedRecipes(item) {
      let affected = []  
      console.log(recipeMap, 'recipe map')
        allRecipes.forEach(recipe => {
            // console.log(recipe.ingredients, 'what is here then?')
            if (recipe.ingredients.includes(item._id)) {
                affected = [...affected, recipe]
            }
        })
        if (affected.length === 0) {
            // console.log(affected, 'what??')
            return alert('No recipes affected.')
        }
      console.log(affected, 'affected recipes')
      return alert(`Warning! These recipes will be affected: ${affected.map(recipe => recipe.name )}`)
  }


  return (
      <div className="pageWrapper" style={{backgroundColor: 'gray', width: '100vw', height: '100vh', padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <div>
        {!loading ? allItems.length ? allItems.map(item=><div key={item._id} onClick={()=>sanity(item)}>{item.name}</div>): <span>No Grocery Items. <a onClick={()=>router.push('/createItems')}>Click To Add</a></span> : <span>Loading</span>}
        {/* Edit Item
        {console.log(allItems, 'hello??')}
        <br />
        <input type="text" placeholder={'Enter Item Name'} onChange={(e) => setName(e.target.value)} value={name}  />
        <br />
        <label htmlFor="items">Choose an item type:</label>
        <select id="items" name="items" onChange={(e) => setDropdownValue(e)} value={type}>
          {ingredientTypes.map((item, i) => <option value={i} key={i}>{item}</option>)}
        </select>
        <br />
        <button onClick={()=>postItem()}>Submit</button> */}
    </div>
    </div>
  );
}  

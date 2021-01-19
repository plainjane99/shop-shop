import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";
// import our custom global state hook
import { useStoreContext } from "../../utils/GlobalState";
// need to use these actions in our dispatch() method
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';

// the old method sent the setCategory prop through the function
// function CategoryMenu({ setCategory }) {
// the global state way no longer requires the prop
function CategoryMenu() {
  // this is how we used to control state
  // const { data: categoryData } = useQuery(QUERY_CATEGORIES);
  // const categories = categoryData?.categories || [];

  // this is how we control state with our global state object
  // call upon the useStoreContext() Hook to retrieve the current state from the global state object and the dispatch() method to update state
  const [state, dispatch] = useStoreContext();
  // we only need the categories array out of our global state, we simply destructure it out
  const { categories } = state;
  
  // query our category data for eventual storage into the global state object, 
  const { data: categoryData } = useQuery(QUERY_CATEGORIES);

  // take the categoryData that returns from the useQuery() Hook and use the dispatch() method to set our global state
  // use the React useEffect() Hook to handle the dispatch of data returned from an async function
  // useEffect runs on load but also when some form of state changes in that component
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
      // sets our category data to the global state
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
    }
  }, [categoryData, dispatch]);

  // create a new function for the click handler to use the global state instead of the function we receive as a prop
  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            // this was the old way
            // setCategory(item._id);
            // this is the global state way
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;

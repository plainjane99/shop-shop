// Reducers are the actual functionality that carries out the emitted action to update state.
// A reducer is a function that updates state by returning a new state object and never alters the original state object

// React Hook to
// set up a function that will know how to take in our state and update it through our reducer() function
import { useReducer } from 'react';

// import our actions
// list of the possible actions we can perform to update state
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from "./actions";

// test the UPDATE_PRODUCTS action to see if we can add a product to the products array
export const reducer = (state, action) => {
    // pass the value of the action.type argument into a switch statement
    switch (action.type) {
        // if action type value is the value of `UPDATE_PRODUCTS`, return a new state object with an updated products array
        case UPDATE_PRODUCTS:
            // return a new object with a copy of the state argument using the spread ... operator
            return {
                ...state,
                // then set the products key to a value of a new array with the action.products value spread across it
                products: [...action.products],
            };

        // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };

        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };

        // if it's none of these actions, do not update state at all and keep things the same!
        default:
            return state;
    }
};

// useProductReducer() will be used to help initialize our global state object 
export function useProductReducer(initialState) {
    // and then provide us with the functionality for updating that state by automatically running it through our custom reducer() function
    // useReducer() Hook is meant specifically for managing a greater level of state
    return useReducer(reducer, initialState);
}
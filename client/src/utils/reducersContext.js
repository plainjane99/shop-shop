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
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from "./actions";

// test the UPDATE_PRODUCTS action to see if we can add a product to the products array
export const reducer = (state, action) => {
    // pass the value of the action.type argument into a switch statement
    switch (action.type) {
        // if action type value is the value of `UPDATE_PRODUCTS`, return a new state object with an updated products array
        case UPDATE_PRODUCTS:
            // return a new object with a copy of the state argument using the spread ... operator
            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                // return a new object with a copy of the state argument
                ...state,
                // then set the products key to a value of a new array with the action.products value spread across it
                products: [...action.products],
            };

        // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                ...state,
                // then set the categories key to a value of a new array with the action.categories value spread across it
                categories: [...action.categories]
            };

        case UPDATE_CURRENT_CATEGORY:
            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                ...state,
                currentCategory: action.currentCategory
            };

        case ADD_TO_CART:
            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                ...state,
                // set cartOpen to true so that users can immediately view the cart with the newly added item
                cartOpen: true,
                // update the cart property to add action.product (which represents the product added) to the end of the array
                cart: [...state.cart, action.product]
            };

        case ADD_MULTIPLE_TO_CART:
            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                ...state,
                // update the cart property to add action.products (which represents the multiple products added) to the end of the array
                cart: [...state.cart, ...action.products],
            };

        case REMOVE_FROM_CART:
            // create a new variable to create a new array
            // filter() method keeps the items that don't match the provided _id property
            let newState = state.cart.filter(product => {
                return product._id !== action._id;
            });

            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                ...state,
                // check the length of the array to set cartOpen to false if array is empty
                cartOpen: newState.length > 0,
                // update the cart property to add the filtered array
                cart: newState
            };

        case UPDATE_CART_QUANTITY:
            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                ...state,
                // set cart to open
                cartOpen: true,
                // original state should be treated as immutable so we use map() to create a new array 
                // the cart is updated with the new array 
                cart: state.cart.map(product => {
                // if there is a match of the id causing the action and the product in the cart
                if (action._id === product._id) {
                    // proceed with updating the quantity
                    product.purchaseQuantity = action.purchaseQuantity;
                }
                // return the product that was updated
                return product;
                })
            };

        case CLEAR_CART:
            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                ...state,
                // set cart to closed
                cartOpen: false,
                // set cart to no items
                cart: []
            };

        case TOGGLE_CART:
            // make a copy of the initial state then update it with whatever the action is doing
            return {
                // preserve everything else on state
                ...state,
                // set state to be the opposite of initial state
                cartOpen: !state.cartOpen
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
// Actions define the types of events that can be emitted to update state. 
// State can only be updated if it's a predefined action

// define how three parts of our state will be maintained and updated

// UPDATE_PRODUCTS is used by the ProductList component
// store the data retrieved for products by Apollo in this global state
export const UPDATE_PRODUCTS = "UPDATE_PRODUCTS";
// 
// take the list of categories retrieved from the server by Apollo and store it in this global state
export const UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
// the connecting piece between UPDATE_PRODUCTS and UPDATE_CATEGORIES
// we want to be able to select a category from the state created by the UPDATE_CATEGORIES action 
// and display products for that category from the list we create from the UPDATE_PRODUCTS action
export const UPDATE_CURRENT_CATEGORY = "UPDATE_CURRENT_CATEGORY";
// create the actions that a shopping cart needs to do
export const ADD_TO_CART = 'ADD_TO_CART';
export const ADD_MULTIPLE_TO_CART = 'ADD_MULTIPLE_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const TOGGLE_CART = 'TOGGLE_CART';
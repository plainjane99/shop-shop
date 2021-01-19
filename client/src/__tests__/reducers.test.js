// import the function we are trying to test
import { reducer } from '../utils/reducers';
// import our actions
// list of the possible actions we can perform to update state
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from '../utils/actions';

// create a sample of what our global state will look like
const initialState = {
    products: [],
    categories: [{ name: 'Food' }],
    // currentCategory refers to the index in the categories array
    currentCategory: '1',
};

// test the UPDATE_PRODUCTS action to see if we can add a product to the products array
test('UPDATE_PRODUCTS', () => {
    // create a new state object
    // equal to the reducer function that accepts the current state object (initialState) and the action to be performed to update state
    let newState = reducer(initialState, {
        // second parameter is an object of the type of action we're performing...
        // i.e. we want to update our products list
        type: UPDATE_PRODUCTS,
        // and the variable representing the new data we want to use with the action
        // i.e. with the contents held in the products array
        products: [{}, {}]
    });

    // The expect() functions we run afterwards will help us confirm that we successfully added our products to the newState and didn't affect initialState in any way, shape, or form
    expect(newState.products.length).toBe(2);
    expect(initialState.products.length).toBe(0);
});

// test the UPDATE_CATEGORIES action to see if we can update the categories array
test('UPDATE_CATEGORIES', () => {
    let newState = reducer(initialState, {
        // the action type and value
        type: UPDATE_CATEGORIES,
        // update our category list to be a new array of categories
        categories: [{}, {}]
    });

    // confirm that we didn't affect our original state values at all and simply used it to create a new version of it
    // The result of the reducer() should show that the length of our updated categories array will be 2, 
    expect(newState.categories.length).toBe(2);
    // while the initial categories array should still be 1
    expect(initialState.categories.length).toBe(1);
});

// test the UPDATE_CURRENT_CATEGORY action to see if we can update the current category
test('UPDATE_CURRENT_CATEGORY', () => {
    let newState = reducer(initialState, {
        // the action type and value
        type: UPDATE_CURRENT_CATEGORY,
        // update the state of currentCategory to a new string
        currentCategory: '2'
    });

    expect(newState.currentCategory).toBe('2');
    expect(initialState.currentCategory).toBe('1');
});
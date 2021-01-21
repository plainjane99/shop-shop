// import the function we are trying to test
import { reducer } from '../utils/reducers';
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
} from '../utils/actions';

// create a sample of what our global state will look like
// i.e. create the initial state
const initialState = {
    // zero products
    products: [],
    // array of categories
    // we only have one category
    categories: [{ name: 'Food' }],
    // currentCategory refers to the index in the categories array
    currentCategory: '1',
    // initial cart values
    cart: [
        {
            _id: '1',
            name: 'Soup',
            purchaseQuantity: 1
        },
        {
            _id: '2',
            name: 'Bread',
            purchaseQuantity: 2
        }
    ],
    // toggle whether cart is open or closed
    cartOpen: false
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
        // ex we have two products added
        products: [{}, {}]
    });

    // The expect() functions we run afterwards will help us confirm that we successfully added our products to the newState and didn't affect initialState in any way, shape, or form
    // newState is two products
    expect(newState.products.length).toBe(2);
    // initial state has zero products
    expect(initialState.products.length).toBe(0);
});

// test the UPDATE_CATEGORIES action to see if we can update the categories array
test('UPDATE_CATEGORIES', () => {
    let newState = reducer(initialState, {
        // the action type and value
        type: UPDATE_CATEGORIES,
        // update our category list to be a new array of categories
        // ex we have two categories
        categories: [{}, {}]
    });

    // confirm that we didn't affect our original state values at all and simply used it to create a new version of it
    // The result of the reducer() should show that the length of our updated categories array
    // ext we have two categories  
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
        // new state is index of 2
        currentCategory: '2'
    });

    // new state should be 2
    expect(newState.currentCategory).toBe('2');
    // initial state was 1
    expect(initialState.currentCategory).toBe('1');
});

// test action to add to cart
test('ADD_TO_CART', () => {
    let newState = reducer(initialState, {
        type: ADD_TO_CART,
        // add a product of quantity 1
        product: { purchaseQuantity: 1 }
    });

    // new state after adding one should be a total of 2
    expect(newState.cart.length).toBe(3);
    // initial state was two items
    expect(initialState.cart.length).toBe(2);
});

test('ADD_MULTIPLE_TO_CART', () => {
    let newState = reducer(initialState, {
        type: ADD_MULTIPLE_TO_CART,
        // add two products
        products: [{}, {}]
    });
    // new cart total is 4 since we added two
    expect(newState.cart.length).toBe(4);
    // initial cart total was two
    expect(initialState.cart.length).toBe(2);
});

test('REMOVE_FROM_CART', () => {
    // remove from cart with id of 1
    let newState1 = reducer(initialState, {
        type: REMOVE_FROM_CART,
        _id: '1'
    });

    // cart is still open
    expect(newState1.cartOpen).toBe(true);

    // the second item should now be the first
    // only 1 item remains
    expect(newState1.cart.length).toBe(1);
    // the id of the second item should be 2
    expect(newState1.cart[0]._id).toBe('2');

    // remove the item with id of 2
    let newState2 = reducer(newState1, {
        type: REMOVE_FROM_CART,
        _id: '2'
    });

    // cart is empty and closed
    expect(newState2.cartOpen).toBe(false);
    // cart quantity is 0
    expect(newState2.cart.length).toBe(0);
    // initial state was 2
    expect(initialState.cart.length).toBe(2);
});

test('UPDATE_CART_QUANTITY', () => {
    let newState = reducer(initialState, {
        type: UPDATE_CART_QUANTITY,
        // update item with id of 1
        _id: '1',
        // update item quantity to 3
        purchaseQuantity: 3
    });

    // set cart open to true
    expect(newState.cartOpen).toBe(true);
    // quantity of item at index 0 is three
    expect(newState.cart[0].purchaseQuantity).toBe(3);
    // quantity of item at index 1 is two
    expect(newState.cart[1].purchaseQuantity).toBe(2);
    // initial state of cart is closed
    expect(initialState.cartOpen).toBe(false);
});

// This test simply expects the cart to be empty (and closed) after the CLEAR_CART action is called
test('CLEAR_CART', () => {
    let newState = reducer(initialState, {
        type: CLEAR_CART
    });
    // cart expected to be closed
    expect(newState.cartOpen).toBe(false);
    // quantity in cart is zero
    expect(newState.cart.length).toBe(0);
    // initial state is two items
    expect(initialState.cart.length).toBe(2);
});

// This test expects cartOpen to be the opposite of its previous value each time the action is called
test('TOGGLE_CART', () => {
    let newState = reducer(initialState, {
        type: TOGGLE_CART
    });

    // cart should be open if previously closed
    expect(newState.cartOpen).toBe(true);
    expect(initialState.cartOpen).toBe(false);

    let newState2 = reducer(newState, {
        type: TOGGLE_CART
    });

    // cart should be closed if previously opened
    expect(newState2.cartOpen).toBe(false);
});
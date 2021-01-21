// import useEffect so set up component to check for items saved in the cart object store of IndexedDB 
// every single time the component opens
// so that users can leave the page and come back to their shopping cart populated
import React, { useEffect } from "react";
import CartItem from '../CartItem';
// conditionally render the checkout button
import Auth from '../../utils/auth';
import './style.css';

// import the global store
import { useStoreContext } from '../../utils/GlobalState';
// import the toggle cart action
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";

// import helper to use IndexedDB
import { idbPromise } from "../../utils/helpers";

const Cart = () => {

    // use the custom useStoreContext Hook to establish
    // a state variable and the dispatch() function to update the state
    const [state, dispatch] = useStoreContext();

    useEffect(() => {
        // create function that retrieves data from the IndexedDB cart object store
        async function getCart() {
          const cart = await idbPromise('cart', 'get');
          dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
        };

        // run the function
        // check if there's anything in the state's cart property on load
        // if no data, retrieve from IndexedDB cart object store and save to global store
        if (!state.cart.length) {
          getCart();
        }

        // list all of the data that this useEffect() Hook is dependent on to execute
        // Hook runs on load no matter what, but then it only runs again if any value in the dependency array has changed since the last time it ran
        // in this particular case, the above function runs if there is nothing in state's cart property
        // but if nothing is returned, the function does not run again because there is no change in the dependency array since it last ran
    }, [state.cart.length, dispatch]);

    console.log(state);

    // create a click handler toggleCart() to have dispatch() call the TOGGLE_CART action
    function toggleCart() {
        dispatch({ type: TOGGLE_CART });
    }

    // This function will add up the prices of everything saved in state.cart
    function calculateTotal() {
        let sum = 0;
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    // If cartOpen is false, the component will return a much smaller <div>. 
    // Clicking this <div>, however, will set cartOpen to true and return the expanded shopping cart
    if (!state.cartOpen) {
        return (
            <div className="cart-closed" onClick={toggleCart}>
                <span
                    role="img"
                    aria-label="trash">🛒</span>
            </div>
        );
    }

    return (
        <div className="cart">
            {/* This handler will toggle the cartOpen value whenever the [close] text is clicked */}
            <div className="close" onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {/* ternary function to conditionally render based off what is in the cart */}
            {state.cart.length ? (
                <div>
                    {state.cart.map(item => (
                        <CartItem key={item._id} item={item} />
                    ))}
                    <div className="flex-row space-between">
                        <strong>Total: ${calculateTotal()}</strong>
                        {
                            Auth.loggedIn() ?
                                <button>
                                    Checkout
                                </button>
                                :
                                <span>(log in to check out)</span>
                        }
                    </div>
                </div>
            ) : (
                <h3>
                    <span role="img" aria-label="shocked">
                        😱
                    </span>
                    You haven't added anything to your cart yet!
                </h3>
            )}
        </div>
    );
};

export default Cart;
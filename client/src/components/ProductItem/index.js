import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers";

// for Global State using Context API
// import local store
// import { useStoreContext } from '../../utils/GlobalState';

// for Global State using Redux, use React-Redux hook
import { useSelector, useDispatch } from 'react-redux';

// import actions
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';

import { idbPromise } from "../../utils/helpers";

function ProductItem(item) {
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  // Global State using Context API
  // use the custom useStoreContext Hook to establish
  // a state variable and the dispatch() function to update the state
  // const [state, dispatch] = useStoreContext();

  // Global State using Redux
  const state = useSelector(state => state);
  const dispatch = useDispatch();

  // declare cart as its own variable so that we don't have to keep writing state.cart
  const { cart } = state;

  // create a click handler toggleCart() to have dispatch() call the TOGGLE_CART action
  // function determine if quantity should be updated or if product should be displayed
  const addToCart = () => {
    // check if the selected item is already in the cart
    // find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);

    // if there was a match, call UPDATE with a new purchase quantity
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

      // update IndexedDB when using global state
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

      // if no match, then add the product
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });

      // update IndexedDB when using global state
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });

    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
        {/* add click handler */}
        <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;

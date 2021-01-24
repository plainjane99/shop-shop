import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from '../assets/spinner.gif'

import { idbPromise } from "../utils/helpers";

// for Global State using Context API
// import our global state hook and action
// import { useStoreContext } from "../utils/GlobalState";

// for Global State using Redux, use React-Redux hook
import { useSelector, useDispatch } from 'react-redux';

import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS
} from "../utils/actions";

// bring in the cart for use
import Cart from '../components/Cart';

function Detail() {
  // the old way
  // const { id } = useParams();

  // const [currentProduct, setCurrentProduct] = useState({})

  // const { loading, data } = useQuery(QUERY_PRODUCTS);

  // const products = data?.products || [];

  // useEffect(() => {
  //   if (products.length) {
  //     setCurrentProduct(products.find(product => product._id === id));
  //   }
  // }, [products, id]);

  // the global state way with regular state
  // for this detail component only because we need to handle both

  // Global State using Context API
  // immediately execute the useStoreContext() function to retrieve the current global state object
  // and the dipatch() method to update state
  // const [state, dispatch] = useStoreContext();

  // Global State using Redux
  const state = useSelector(state => state);
  const dispatch = useDispatch();


  // use react router hook to get the id from the products for the detail component
  const { id } = useParams();
  // detail views of the product are not beneficial to be saved to the global state
  // since it will be viewed at a specific moment
  // so we use useState
  const [currentProduct, setCurrentProduct] = useState({})
  // query the database for data
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  // destructure products and cart from the state object
  const { products, cart } = state;

  // function determine if quantity should be updated or if product should be displayed
  const addToCart = () => {

    // check if the selected item is already in the cart
    // find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    // if there was a match, call UPDATE with a new purchase quantity
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

      // when we use global state, we will update IndexedDB as well
      // if we're updating quantity, use existing item data and increment purchaseQuantity value by one
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

      // if no match, then add the product
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      });

      // when we use global state, we will update IndexedDB as well
      // if product isn't in the cart yet, add it to the current shopping cart in IndexedDB
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });

    }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    });

    // when we use global state, we will update IndexedDB as well
    // upon removal from cart, delete the item from IndexedDB using the `currentProduct._id` to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });

  };

  // check if we have data returning from a global state and stored in products
  // implement the useEffect() Hook in order to wait for our useQuery() response to come in
  useEffect(() => {
    // checks if there's data in our global state's products array
    if (products.length) {
      // use the useState locally stored version
      // figure out which product is the current one that we want to display
      // It does this finding the one with the matching _id value that we grabbed from the useParams() Hook
      setCurrentProduct(products.find(product => product._id === id));

      // if no data exists in the global state,
      // use the product data from the useQuery() Hook to set the product data to the global state object
    } else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      // place retrieved data into IndexedDB
      // functionality also required here in case a user goes directly into a detail product view rather than the homepage
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }

    // if no data because user is offline
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        });
      });
    }

    // second argument of the useEffect hook contains a dependency array
    // hook needs these dependencies to run
  }, [products, data, loading, dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">
            ← Back to Products
          </Link>

          <h2>{currentProduct.name}</h2>

          <p>
            {currentProduct.description}
          </p>

          <p>
            <strong>Price:</strong>
            ${currentProduct.price}
            {" "}
            <button onClick={addToCart}>
              Add to Cart
            </button>
            <button 
              disabled={!cart.find(p => p._id === currentProduct._id)} 
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {
        loading ? <img src={spinner} alt="loading" /> : null
      }

      <Cart />

    </>
  );
};

export default Detail;

import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif"

// import custom global state hook functionality and actions
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';

// function ProductList({ currentCategory }) {
function ProductList() {

  // this is the old props way
  // const { loading, data } = useQuery(QUERY_PRODUCTS);

  // const products = data?.products || [];

  // function filterProducts() {
  //   if (!currentCategory) {
  //     return products;
  //   }

  //   return products.filter(product => product.category._id === currentCategory);
  // }

  // this is the global state way
  // immediately execute the useStoreContext() function to retrieve the current global state object
  // and the dipatch() method to update state
  const [state, dispatch] = useStoreContext();
  // destructure the currentCategory data out of the state object so we can use it in the filterProducts() function
  const { currentCategory } = state;
  // query our database for data
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // implement the useEffect() Hook in order to wait for our useQuery() response to come in
  useEffect(() => {
    // Once the data object returned from useQuery(), execute our dispatch() function
    if (data) {
      dispatch({
        // action
        type: UPDATE_PRODUCTS,
        // save the array of product data to our global store
        products: data.products
      });
    }
  }, [data, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {/* revised from products.length */}
      {/* since we are now retrieving products from the state object */}
      {state.products.length ? (
        <div className="flex-row">
            {filterProducts().map(product => (
                <ProductItem
                  key= {product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                />
            ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      { loading ? 
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default ProductList;

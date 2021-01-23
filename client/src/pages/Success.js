import React, { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Jumbotron from "../components/Jumbotron";
import { ADD_ORDER } from "../utils/mutations"
import { idbPromise } from "../utils/helpers";

function Success() {

    // set up the initial logic
    // import the mutation
    const [addOrder] = useMutation(ADD_ORDER);

    // When the Success component loads
    // i.e. the order was successful
    // we need to read everything that's saved in the IndexedDB cart store
    // save the order and remove from IndexedDB
    useEffect(() => {

        async function saveOrder() {
            // use idbPromise to get item data from cart and assign to cart
            const cart = await idbPromise('cart', 'get');
            // map the cart items into an array of product IDs
            const products = cart.map(item => item._id);

            // if there's something in the cart
            if (products.length) {
                // pass the product IDs in products to the addOrder mutation
                const { data } = await addOrder({ variables: { products } });
                // save the data to a new variable when mutation has executed
                const productData = data.addOrder.products;
                // delete all of the IDs from the indexedDB store
                productData.forEach((item) => {
                  idbPromise('cart', 'delete', item);
                });
            }

        }

        setTimeout(() => {
            window.location.assign('/');
        }, 3000);    

        // call the function
        saveOrder();

    }, [addOrder]);

    return (
        <div>
            <Jumbotron>
                <h1>Success!</h1>
                <h2>
                    Thank you for your purchase!
                </h2>
                <h2>
                    You will now be redirected to the homepage
                 </h2>
            </Jumbotron>
        </div>
    );

};

export default Success;
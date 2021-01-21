// createContext will be used to create the container to hold our global state data and functionality
// useContext is another React Hook that will allow us to use the state created from the createContext function
import React, { createContext, useContext } from "react";
import { useProductReducer } from './reducers';

// instantiate the global state object
const StoreContext = createContext();
// pull Provider from Context object 
// Provider is a special type of React component that we wrap our application in 
// so it can make the state data that's passed into it as a prop available to all other components. 
const { Provider } = StoreContext;

// we are creating our own functionality to manage state at a global level and make it available to all other components
// through a special <Provider> component
// create a custom provider function that will be used to manage and update our state using the reducer function
// set up StoreProvider function to accept props
// value prop is included to pass in more data for state as needed (which it's not in this application)
const StoreProvider = ({ value = [], ...props }) => {

    // -------------------this defines the initial state ---------------------------------------
    // instantiate our initial global state with the useProductReducer() function
    // the useProductReducer() function wraps around useReducer() hook (see reducers.js file) 
    // which returns the state and dispatch parameters
    // state is the most up-to-date version of our global state object
    // dispatch is the method we execute to update our state
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: '',
    });

    // use this to confirm it works!
    // return the StoreContext's <Provider> component with our state object 
    // and dispatch the function provided as data for the value prop
    console.log(state);
    return <Provider value={[state, dispatch]} {...props} />;
};

// create the custom function to be used by the components that actually need the data
// When we execute this function from within a component, we will receive the [state, dispatch] data our StoreProvider provider manages for us
const useStoreContext = () => {
    return useContext(StoreContext);
};

// export the custom functions for use
export { StoreProvider, useStoreContext };
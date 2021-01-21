import React from 'react';

import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';

// This component expects an item object as a prop and will use that object's properties to populate the JSX
const CartItem = ({ item }) => {

    // we only destructure the dispatch() function from the useStoreContext Hook, 
    // because the CartItem component has no need to read state
    const [, dispatch] = useStoreContext();

    const removeFromCart = item => {
        dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
        });
    };

    // handle user changing the quantity of an item in the cart
    const onChange = (e) => {
        const value = e.target.value;
      
        // if zero, perform remove from cart action
        if (value === '0') {
          dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
          });
        // otherwise update the quantity
        } else {
          dispatch({
            type: UPDATE_CART_QUANTITY,
            _id: item._id,
            purchaseQuantity: parseInt(value)
          });
        }
    };

    return (
        <div className="flex-row">
            <div>
                <img
                    src={`/images/${item.image}`}
                    alt=""
                />
            </div>
            <div>
                <div>{item.name}, ${item.price}</div>
                <div>
                    <span>Qty:</span>
                    {/* add the onChange handler */}
                    <input
                        type="number"
                        placeholder="1"
                        value={item.purchaseQuantity}
                        onChange={onChange}
                    />
                    {/* add click handler */}
                    <span
                        role="img"
                        aria-label="trash"
                        onClick={() => removeFromCart(item)}
                    >
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
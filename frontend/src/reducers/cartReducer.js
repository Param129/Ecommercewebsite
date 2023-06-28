import {
  ADD_TO_CART,
  REMOVE_CART_ITEMS,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstant";


export const cartReducer = (state ={ cartItems: [],shippingInfo:{} },action)=>{
    switch(action.type){
        case ADD_TO_CART:
            const item = action.payload;
//check if product already in cart by comparing product id
            const isItemExist = state.cartItems.find(
              (i) => i.product === item.product
            );
      
            if (isItemExist) {
              return {
                ...state,
                // find and replace with item
                cartItems: state.cartItems.map((i) =>
                  i.product === isItemExist.product ? item : i
                ),
              };
            } else {
              return {
                ...state,
                // adding product to cart
                cartItems: [...state.cartItems, item],
              };
            }

        case REMOVE_CART_ITEMS:
          return{
            ...state,
            //al will go than this id in payload.
            cartItems:state.cartItems.filter((i)=>i.product!==action.payload),


          }

          case SAVE_SHIPPING_INFO:
            return {
              ...state,
              shippingInfo: action.payload,
            };

        default:
            return state;
    }
}
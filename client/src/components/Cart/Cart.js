import React, { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { Tshirt } from "../Tshirt/Tshirt";
import { TshirtList } from "../Tshirt/TshirtList";
import API from "../../lib/API";
import Modal from 'react-modal';
import AuthContext from "../../contexts/AuthContext"
import Swal from 'sweetalert2';
import './Cart.css';
import Fade from 'react-reveal/Fade';
import Zoom from "react-reveal/Zoom";

export const Cart = (props) => {
  const [cart, cartDispatch] = useContext(CartContext);
  const [modal, setModal] = useState(false);
  const { user, authToken } = useContext(AuthContext)

  const modifyCart = (id, amnt) => {

    cartDispatch({
      type: "UPDATE_QUANTITY",
      id, amnt
    })
  }

  const submitCart = () => {
    cartDispatch({
      type: "SUBMIT_ORDER"
    })
  }

  const handleCheckoutButton = (event) => {
    event.preventDefault();
    // console.log(authToken);
    // console.log(cart)
    let productIdArray = [];
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].quantity > 1) {
        for (let x = 0; x < cart[i].quantity; x++) {
          productIdArray.push(cart[i].id)
        }
      } else {
        productIdArray.push(cart[i].id)
      }
    }
    API.Orders.createOrder(productIdArray, authToken)
      .then(data => {

        // alert("Order Created " + JSON.stringify(data[0].OrderId));
        // alert("order created " +  JSON.stringify(data.data[0][0].OrderId));

        Swal.fire({
          title: "Order ID: UNCCEQUIP400" + JSON.stringify(data.data[0][0].OrderId) + '\n'   + " created successfully!",
          text: 'Your order is being processed and will ship soon.',
          icon: 'success',
          confirmButtonText: 'Okay'
        })

        console.log("order created", data.data[0]);
        submitCart();

      })
      .catch(err => {
        console.log(err)
      })
    // cart.map(item => (
    //   console.log(item.id, item.quantity)
    // )
    //   .then(data => {

    //     console.log("order created")
    //   })
    //   .catch(err => {
    //     console.log(err)
    // //   })

  }


  return (
    <div>
      <br />
      {!cart.length ? (
        <div className="cart cart-header">Cart is empty</div>
      ) : (
          <div className="cart cart-header">
            <Fade left cascade>
            <h5>You have {cart.reduce((acc, curr) => acc + curr.quantity, 0)} item(s) in the cart{" "}</h5>
            {cart.map((item, i) => (
              <p key={i + '-key'}>

                <div className="item">
                  <div className="image">
                    <img className="image-max-height" src={item.image} alt="" />
                  </div>
                  <div className="description">
                    <span className="cartSpan">{item.name}</span>
                  </div>
                  <div className="quantity">
                  <div className="q">
                    <button onClick={() => modifyCart(item.id, 1)} className="plus-btn" type="button" name="button">
                      <i className="fas fa-plus"></i>
                    </button>
                    <input className="plusMinus" type="text" name="name" value={item.quantity} />
                    <button onClick={() => modifyCart(item.id, -1)} className="minus-btn" type="button" name="button">
                      <i className="fas fa-minus"></i>
                    </button>
                    </div>
                  </div>
                </div>
              </p>
            ))}
            </Fade>
            <span>Total price : ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} </span>

            <button onClick={handleCheckoutButton}>Checkout</button>
          </div>
        )}
      <br />
    </div>
  )
}

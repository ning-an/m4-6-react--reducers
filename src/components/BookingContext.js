import React, { createContext, useReducer } from "react";

export const BookingContext = createContext();

const initialState = {
  status: "idle",
  error: null,
  selectedSeatId: null,
  price: null,
};
const reducer = (state, action) => {
  if (action.type === "begin-booking-process") {
    console.log(action);
    return {
      ...state,
      selectedSeatId: [action.rowIndex, action.seatIndex],
      price: action.price,
    };
  }
  return state;
};

export const BookingProvider = ({ children }) => {
  const [bookingState, dispatch] = useReducer(reducer, initialState);

  const beginBookingProcess = (data) => {
    dispatch({ type: "begin-booking-process", ...data });
  };

  return (
    <BookingContext.Provider
      value={{ bookingState, actions: { beginBookingProcess } }}
    >
      {children}
    </BookingContext.Provider>
  );
};

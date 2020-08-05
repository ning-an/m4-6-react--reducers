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
    return {
      ...state,
      selectedSeatId: [action.rowName, action.seatIndex],
      price: action.price,
    };
  } else if (action.type === "cancel-booking-process") {
    return initialState;
  }
  return state;
};

export const BookingProvider = ({ children }) => {
  const [bookingState, dispatch] = useReducer(reducer, initialState);

  const beginBookingProcess = (data) => {
    dispatch({ type: "begin-booking-process", ...data });
  };
  const cancelBookingProcess = () => {
    dispatch({ type: "cancel-booking-process" });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        actions: { beginBookingProcess, cancelBookingProcess },
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

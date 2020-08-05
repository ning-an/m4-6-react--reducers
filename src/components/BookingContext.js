import React, { createContext, useReducer } from "react";

export const BookingContext = createContext();

const initialState = {
  status: "idle",
  error: null,
  selectedSeatId: null,
  price: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "begin-booking-process":
      return {
        ...state,
        selectedSeatId: [action.rowName, action.seatIndex],
        price: action.price,
        status: "seat-selected",
      };
    case "cancel-booking-process":
      return initialState;
    case "purchase-ticket-request":
      return {
        ...state,
        status: "awaiting-response",
      };
    case "purchase-ticket-failure":
      return {
        ...state,
        status: "error",
        error: "Please provide credit card information.",
      };
    case "purchase-ticket-success":
      return {
        ...initialState,
        status: "purchased",
      };
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [bookingState, dispatch] = useReducer(reducer, initialState);

  const beginBookingProcess = (data) => {
    dispatch({ type: "begin-booking-process", ...data });
  };
  const cancelBookingProcess = () => {
    dispatch({ type: "cancel-booking-process" });
  };
  const purchaseTicketRequest = () => {
    dispatch({ type: "purchase-ticket-request" });
  };
  const purchaseTicketFailure = () => {
    dispatch({ type: "purchase-ticket-failure" });
  };
  const purchaseTicketSuccess = () => {
    dispatch({ type: "purchase-ticket-success" });
  };
  return (
    <BookingContext.Provider
      value={{
        bookingState,
        actions: {
          beginBookingProcess,
          cancelBookingProcess,
          purchaseTicketRequest,
          purchaseTicketFailure,
          purchaseTicketSuccess,
        },
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// app/_context/customer-context.js
"use client";
import { createContext, useContext, useReducer } from "react";

const CustomerContext = createContext();

const initialState = {
  customer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "setCustomer":
      return { ...state, customer: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

export function CustomerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Provide both state and dispatch (or helper setter)
  const setCustomer = (customer) =>
    dispatch({ type: "setCustomer", payload: customer });

  return (
    <CustomerContext.Provider value={{ ...state, setCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}

"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

const PayPalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PayPalScriptProvider
      options={{
        // TODO: change client_id to something else because you're using the default client id. Also first hash the client id because we're exposing this on the frontend
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
        currency: "EUR",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;

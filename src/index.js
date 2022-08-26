import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DraftProvider } from "./DraftContext";

const queryClient = new QueryClient({
	// defaultOptions: {
	// 	queries: {
	// 		refetchOnWindowFocus: false,
	// 		refetchOnmount: false,
	// 		refetchOnReconnect: false,
	// 		retry: false,
	// 		staleTime: 5 * 60 * 1000
	// 	}
	// }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<DraftProvider>
		<QueryClientProvider client={queryClient}>
			<App />
			<ReactQueryDevtools />
		</QueryClientProvider>
	</DraftProvider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./main.css";
import { Game } from "./views/game";
import { Stats } from "./views/stats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 60 * 24 } } });
const router = createBrowserRouter([
	{
		path: "/game",
		element: <Game />,
	},
	{
		path: "/stats",
		element: <Stats />,
	},
]);

ReactDOM.createRoot(document.body).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
);

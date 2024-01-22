import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./main.css";
import { Game } from "./views/game";
import { Stats } from "./views/stats";

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
		<RouterProvider router={router} />
	</React.StrictMode>
);

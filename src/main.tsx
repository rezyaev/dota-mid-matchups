import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Game } from "./views/game";
import "./main.css";

const router = createBrowserRouter([
	{
		path: "/game",
		element: <Game />,
	},
]);

ReactDOM.createRoot(document.body).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

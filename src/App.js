// import "./App.css";
// import Comp from "./Comp";

// function App() {
// 	return (
// 		<>
// 			<Comp />
// 		</>
// 	);
// }

// export default App;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import fetchPosts from "./FetchApi";
import "./App.css";

function App() {
	const { data, error, isError, isLoading } = useQuery(["users"], fetchPosts);

	let picks = data;

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		console.log(error);
		return <div>Error! {error.message}</div>;
	}

	// picks.forEach((pick) => console.log(pick.prospect));

	return (
		<div className="">
			<h1 className="container">Draft</h1>
			{data?.map((picks, id) => {
				return (
					<li className="container" key={id}>
						{picks.prospect.fullName}
					</li>
				);
			})}
		</div>
	);
}

export default App;

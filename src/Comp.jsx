import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import fetchPosts from "./FetchApi";

// let fetchDraft = async () => {
// 	const { data } = await axios.get(
// 		"https://jsonplaceholder.typicode.com/posts"
// 	);
// 	return data;
// };

const Comp = () => {
	const { data, error, isError, isLoading } = useQuery("draft", fetchPosts);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	// if (isError) {
	// 	console.log(data);
	// 	return <div>Error! {error.message}</div>;
	// }

	return (
		<>
			<h1>React Query Draft Example</h1>
			{/* {data.map((rounds, index) => (
				<li key={index}>{rounds}</li>
			))} */}
			<div>{data} duhhhhhh</div>
		</>
	);
	// const { isLoading, error, data } = useQuery("draft", () =>
	// 	axios("http://swapi.dev/api/people/1/")
	// );

	// return (
	// 	<>
	// 		<h1>React Query Draft Example</h1>

	// 		{error && <div>Something went wrong...</div>}

	// 		{isLoading ? (
	// 			<div>Retrieving info</div>
	// 		) : (
	// 			<pre>{JSON.stringify(data, null, 2)}</pre>
	// 		)}
	// 	</>
	// );
};

export default Comp;

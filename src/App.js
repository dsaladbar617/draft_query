import React from "react";
import "./App.css";
import Nav from "./_components/Nav";
import DraftTable from "./_components/DraftTable";

function App() {
	// picks.forEach((pick) => console.log(pick.prospect));

	return (
		<div className="">
			<Nav />
			<DraftTable />
		</div>
	);
}

export default App;

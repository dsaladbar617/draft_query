import React, { useState } from "react";

const DraftContext = React.createContext("");

const DraftProvider = ({ children }) => {
	// const [draft, setDraft] = useState([]);
	const [draftYear, setDraftYear] = useState(2022);
	const [teamName, setTeamName] = useState("");
	const [filteredDraft, setFilteredDraft] = useState([]);
	const [currentProspectId, setCurrentProspectId] = useState(0);
	const [playerStats, setPlayerStats] = useState({});
	const [currentPlayer, setCurrentPlayer] = useState("");
	const [picks, setPicks] = useState([]);

	const values = {
		// draft,
		draftYear,
		teamName,
		filteredDraft,
		currentProspectId,
		playerStats,
		currentPlayer,
		picks
	};

	const setters = {
		// setDraft,
		setDraftYear,
		setTeamName,
		setFilteredDraft,
		setCurrentProspectId,
		setPlayerStats,
		setCurrentPlayer,
		setPicks
	};

	return (
		<DraftContext.Provider value={{ values, setters }}>
			{children}
		</DraftContext.Provider>
	);
};

export { DraftContext, DraftProvider };

import axios from "axios";

const fetchProspects = async (year, teamName) => {
	const { data } = await axios.get(
		`https://statsapi.web.nhl.com/api/v1/draft/${year}`
	);

	let drafted = data.drafts[0].rounds.map((round) => round.picks).flat(2);

	return !teamName || teamName === "None"
		? drafted
		: drafted.filter((draft) => draft.team.name === teamName);
};

export default fetchProspects;

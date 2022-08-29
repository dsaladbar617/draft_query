import axios from "axios";

const fetchProspects = async (year, teamName) => {
	const { data: draft } = await axios.get(
		`https://statsapi.web.nhl.com/api/v1/draft/${year}`
	);

	let drafted = draft.drafts[0].rounds.map((round) => round.picks).flat(2);

	return !teamName
		? drafted
		: drafted.filter((draft) => draft.team.name === teamName);
};

const fetchProspectStats = async (id) => {
	// console.log(id);
	if (id != 0) {
		const data = await axios.get(
			`https://statsapi.web.nhl.com/api/v1/draft/prospects/${id}`
		);
		// if (id !== undefined) {
		// console.log(data);
		return data.data.prospects[0].nhlPlayerId;
	}
	// return data.data.prospects[0];

	// console.log(prospect);

	// return prospect;
	// }

	// Promise.all(
	// 	arr.forEach((id) => {
	// 		if (id !== undefined) {
	// 			const { data: prospect } = axios.get(
	// 				`https://statsapi.web.nhl.com/api/v1/prospect/${id}`
	// 			);

	// 			console.log(prospect);

	// 			return prospect;
	// 		}
	// 	})
	// );
};

export { fetchProspects, fetchProspectStats };

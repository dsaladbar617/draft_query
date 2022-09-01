import axios from "axios";

const fetchProspects = async (year) => {
	const { data: draft } = await axios.get(
		`https://statsapi.web.nhl.com/api/v1/draft/${year}`
	);

	// return draft.drafts[0].rounds.map((round) => round.picks).flat(2);

	let drafted = draft.drafts[0].rounds.map((round) => round.picks).flat(2);

	console.log();

	return drafted;

	// return !teamName || teamName === "None"
	// 	? drafted
	// 	: drafted.filter((draft) => draft.team.name === teamName);
};

const fetchProspectIds = async (arr) => {
	// statArr = [...currentStats];
	let statArr = arr.map((item) => item.prospect.link);

	// console.log(statArr);

	let ids = await Promise.all(
		statArr.map((endpoint) => {
			if (!endpoint.includes("null")) {
				// console.log(endpoint);
				return axios
					.get(`https://statsapi.web.nhl.com/${endpoint}`)
					.then((res) => res);
			} else {
				return null;
			}
		})
	);
	return ids.map((elem) =>
		elem.data.hasOwnProperty("value")
			? elem.data.value
			: elem.data.prospects[0].nhlPlayerId
	);
	// if (id) {
	// 	const stats = await fetch(
	// 		`https://statsapi.web.nhl.com//api/v1/draft/prospects/${id}`
	// 	)
	// 		.then((res) => res.json())
	// 		.then((data) => data.prospects[0].nhlPlayerId)
	// 		.then((nhlId) => {
	// 			return fetch(
	// 				`https://statsapi.web.nhl.com//api/v1/people/${nhlId}/stats?stats=careerRegularSeason`
	// 			)
	// 				.then((res) => res.json())
	// 				.then((data) => {
	// 					return data.stats[0].splits.length > 0
	// 						? data.stats[0].splits[0].stat
	// 						: { value: "No NHL Data" };
	// 				});
	// 		});

	// 	statArr[index] = stats;
	// 	// setCurrentStats(statArr);
	// 	return statArr;
	// }
};

const fetchStats = async (idArr) => {
	let stats = await Promise.all(
		idArr.map((nhlId) => {
			return axios
				.get(
					`https://statsapi.web.nhl.com//api/v1/people/${nhlId}/stats?stats=careerRegularSeason`
				)
				.then((res) => res);
		})
	);

	return stats;
};

export { fetchProspects, fetchProspectIds, fetchStats };

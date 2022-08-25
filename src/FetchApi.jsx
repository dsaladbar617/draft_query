import axios from "axios";

const fetchPosts = async () => {
	const { data } = await axios.get(
		"https://statsapi.web.nhl.com/api/v1/draft/2020"
	);

	return data.drafts[0].rounds.map((round) => round.picks).flat(2);
};

export default fetchPosts;

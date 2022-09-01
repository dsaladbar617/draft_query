import React, { useContext, useEffect, useState, useRef } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchProspects, fetchProspectIds, fetchStats } from "../FetchApi";
import { DraftContext } from "../DraftContext";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/material/styles";
import { queryClient } from "../index.js";

const DraftTable = () => {
	const { values, setters } = useContext(DraftContext);
	let [currentStats, setCurrentStats] = useState([]);
	let [hoverId, setHoverId] = useState(0);
	let [expanded, setExpanded] = useState([]);
	let [renderedPicks, setRenderedPicks] = useState([]);
	let [currentYearPicks, setCurrentYearPicks] = useState([]);

	const {
		data: draftPicks,
		error,
		isError,
		isLoading
	} = useQuery(["prospects", values.draftYear], async () => {
		let currentPicks = await fetchProspects(values.draftYear);
		setCurrentYearPicks(currentPicks);
		setRenderedPicks(currentPicks);
		setExpanded([...currentPicks.map(() => false)]);

		if (values.teamName) {
			setRenderedPicks(
				currentPicks.filter((draft) => draft.team.name === values.teamName)
			);
		} else {
			setRenderedPicks(currentPicks);
		}
		return currentPicks;
	});

	let picks = draftPicks;

	// fetchStats(picks);

	const { data: ids } = useQuery(
		["ids", picks],
		async () => {
			let statArr = await fetchProspectIds(picks);
			console.log(statArr);
			// picks.length = 0;
			return statArr;
		},
		{
			enabled: !!picks
		}
	);

	let nhlIds = ids;

	const { data: nhlStats } = useQuery(
		["stats", nhlIds],
		async () => {
			let stats = await fetchStats(nhlIds);
			// nhlIds.length = 0;
			return stats.map((elem) =>
				elem.data.stats[0].splits.length > 0
					? elem.data.stats[0].splits[0]
					: { value: "No NHL Stats" }
			);
		},
		{
			enabled: !!nhlIds
		}
	);

	useEffect(() => {
		if (nhlStats) {
			console.log(nhlStats);
		}
	}, [nhlStats]);

	useEffect(() => {
		if (values.teamName) {
			// picks = picks.filter((draft) => draft.team.name === values.teamName);
			setRenderedPicks(
				picks.filter((draft) => draft.team.name === values.teamName)
			);
		} else {
			setRenderedPicks(currentYearPicks);
		}
	}, [values.teamName]);

	const handleStats = async (id, index) => {
		let statArr = [...currentStats];

		if (id) {
			const stats = await fetch(
				`https://statsapi.web.nhl.com//api/v1/draft/prospects/${id}`
			)
				.then((res) => res.json())
				.then((data) => data.prospects[0].nhlPlayerId)
				.then((nhlId) => {
					return fetch(
						`https://statsapi.web.nhl.com//api/v1/people/${nhlId}/stats?stats=careerRegularSeason`
					)
						.then((res) => res.json())
						.then((data) => {
							return data.stats[0].splits.length > 0
								? data.stats[0].splits[0].stat
								: { value: "No NHL Data" };
						});
				});

			statArr[index] = stats;
			setCurrentStats(statArr);

			return stats;
		}
	};

	// const { data: stats, refetch } = useQuery(["stats", refProspectId], () =>
	// 	fetchProspectStats(refProspectId.current)
	// );

	// console.log(stats);

	// const { data: draftStats } = useQuery(
	// 	[picks],
	// 	// [picks?.map((pick) => pick.prospect.id)],
	// 	(prospId) => {
	// 		// console.log(prospId.queryKey);
	// 		// prospId.queryKey.map((pick) => fetchProspectStats(pick.prospect.id));
	// 		fetchProspectStats(prospId.queryKey[0]);
	// 	},
	// 	{ enabled: !!picks }
	// );

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 14
		}
	}));

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover
		},
		// hide last border
		"&:last-child td, &:last-child th": {
			border: 0
		}
	}));

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error! {error.message}</div>;
	}

	const createData = (
		round,
		overAll,
		teamName,
		prospectName,
		prospectId,
		rowIndex
	) => {
		return {
			round,
			overAll,
			teamName,
			prospectName,
			prospectId,
			rowIndex
			// stats: {

			// }
		};
	};

	const Row = (props) => {
		const { row } = props;

		// const [open, setOpen] = React.useState(false);

		// const handleCollapse = (id) => {
		// 	// open === false ? setOpen(true) refetch(): setOpen(false);

		// 	if (open === false) {
		// 		setOpen(true);
		// 		// refProspectId.current = id;
		// 		// refetch();
		// 	} else {
		// 		setOpen(false);
		// 	}
		// };

		const handleClick = (index) => {
			let newArr = [...expanded];
			newArr[index] = !newArr[index];
			setExpanded(newArr);
		};

		return (
			<>
				<TableRow
					hover
					sx={{ "& > *": { borderBottom: "unset" } }}
					onClick={() => {
						handleClick(row.rowIndex);
						// console.log(refProspectId.current);
					}}
					onMouseEnter={async () => {
						setHoverId(row.rowIndex);
						await queryClient.prefetchQuery(
							["stat", hoverId],
							async () => {
								if (!expanded[row.rowIndex] && hoverId !== 0) {
									setters.setCurrentProspectId(row.prospectId);
									let stats = await handleStats(row.prospectId, row.rowIndex);
									row.stats = stats;
									console.log(stats);
								}
							}
							// handleStats(row.prospectId, row.rowIndex)
						);
					}}>
					<TableCell>
						<IconButton aria-label="expand row" size="small">
							{expanded[row.rowIndex] ? (
								<KeyboardArrowUpIcon />
							) : (
								<KeyboardArrowDownIcon />
							)}
						</IconButton>
					</TableCell>
					<TableCell component="th" scope="row" align="right">
						{row.round}
					</TableCell>
					<TableCell align="right">{row.overAll}</TableCell>
					<TableCell align="right">{row.teamName}</TableCell>
					<TableCell align="right">{row.prospectName}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
						<Collapse in={expanded[row.rowIndex]} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Typography variant="h6" gutterBottom component="div">
									{`${row.prospectName} Stats`}
								</Typography>
								{currentStats[row.rowIndex]?.hasOwnProperty("assists")
									? `Assists: ${currentStats[row.rowIndex]?.assists}`
									: currentStats[row.rowIndex]?.hasOwnProperty("saves")
									? `Saves: ${currentStats[row.rowIndex]?.saves}`
									: currentStats[row.rowIndex]?.value}
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			</>
		);
	};

	Row.propTypes = {
		row: PropTypes.shape({
			round: PropTypes.string.isRequired,
			overAll: PropTypes.number.isRequired,
			teamName: PropTypes.string.isRequired,
			prospectName: PropTypes.string.isRequired,
			prospectId: PropTypes.number,
			stats: PropTypes.object
		})
	};

	const rows = renderedPicks?.map((pick, index) => {
		return createData(
			pick.round,
			pick.pickOverall,
			pick.team.name,
			pick.prospect.fullName,
			pick.prospect.id,
			index
		);
	});

	return (
		<TableContainer sx={{ width: 2 / 3, margin: "auto" }} component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<StyledTableRow>
						<StyledTableCell />
						<StyledTableCell align="right">Round</StyledTableCell>
						<StyledTableCell align="right">Overall</StyledTableCell>
						<StyledTableCell align="right">Team Name</StyledTableCell>
						<StyledTableCell align="right">Prospect</StyledTableCell>
					</StyledTableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, index) => (
						<Row className="that" key={index} row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default DraftTable;

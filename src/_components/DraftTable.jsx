import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { fetchProspects, fetchProspectStats } from "../FetchApi";
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

const DraftTable = () => {
	const { values, setters } = useContext(DraftContext);
	const [prospectId, setProspectId] = useState(0);

	const {
		data: draftPicks,
		error,
		isError,
		isLoading
	} = useQuery(["prospects", values.draftYear, values.teamName], () =>
		fetchProspects(values.draftYear, values.teamName)
	);

	let picks = draftPicks;
	// setters.setPicks(picks);

	// const { data: stats } = useQuery(["stats", prospectId], () =>
	// 	fetchProspectStats(prospectId)
	// );

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

	// const statsQueries = useQueries({
	// 	queries:
	// 		picks?.map((pick) => {
	// 			// console.log(pick);
	// 			return {
	// 				queryKey: ["stat", pick.prospect],
	// 				queryFn: () => fetchProspectStats(pick.prospect.id)
	// 			};
	// 		}) ?? []
	// });

	// console.log(statsQueries);

	// function App({ users }) {
	// 	const userQueries = useQueries({
	// 		queries: users.map((user) => {
	// 			return {
	// 				queryKey: ["user", user.id],
	// 				queryFn: () => fetchUserById(user.id)
	// 			};
	// 		})
	// 	});
	// }

	// console.log(draftStats);

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

	const createData = (round, overAll, teamName, prospectName, prospectId) => {
		return {
			round,
			overAll,
			teamName,
			prospectName,
			prospectId
			// stats: {

			// }
		};
	};

	const Row = (props) => {
		const { row } = props;
		const [open, setOpen] = React.useState(false);

		const handleCollapse = () => {
			// setProspectId(row.prospectId);
			// console.log(row.prospectId);
			setOpen(!open);

			// setters.setCurrentProspectId(id);
			// setters.setCurrentProspectId(row.prospectId);

			// setTimeout(() => {
			// }, 100);
		};

		// useEffect(() => {
		// 	if (open) {
		// 		setProspectId(row.prospectId);
		// 	}
		// }, [open]);

		return (
			<>
				<TableRow
					sx={{ "& > *": { borderBottom: "unset" } }}
					onClick={() => {
						handleCollapse();
					}}>
					<TableCell>
						<IconButton aria-label="expand row" size="small">
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Typography variant="h6" gutterBottom component="div">
									{`${row.prospectName} Stats`}
								</Typography>
								<div>{fetchProspectStats(row.prospectId)}</div>
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
			prospectId: PropTypes.number.isRequired,
			stats: PropTypes.object
		})
	};

	const rows = picks.map((pick) => {
		return createData(
			pick.round,
			pick.pickOverall,
			pick.team.name,
			pick.prospect.fullName,
			pick.prospect.id
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
					{rows.map((row) => (
						<Row className="that" key={row.name} row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default DraftTable;

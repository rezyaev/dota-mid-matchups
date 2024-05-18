import { useEffect, useState } from "react";
import { HEROES } from "../config";

const TOKEN =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiOGI0NDQyMWMtNDQwNy00YjlkLTllNGItNmExNzE2NzA4Y2EwIiwiU3RlYW1JZCI6IjEzNzM0MjE3OSIsIm5iZiI6MTcwMDcwMjQ0MywiZXhwIjoxNzMyMjM4NDQzLCJpYXQiOjE3MDA3MDI0NDMsImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.zK1k2iTqZavSf02DiY0cQFWF6_ZgcF9-lfz8erPIdYA";
const API_URL = "https://api.stratz.com/graphql";
const STATS_QUERY = `
{
    heroStats { 
      laneOutcome(isWith: false, positionIds: [POSITION_2]) {
        heroId1
        lossCount
        matchCount
		winCount
        stompWinCount
        stompLossCount
      }
    }
  }
`;

type LaneOutcome = {
	heroId1: number;
	lossCount: number;
	matchCount: number;
	winCount: number;
	stompWinCount: number;
	stompLossCount: number;
};

export function Stats() {
	const [stats, setStats] = useState<LaneOutcome[]>([]);

	useEffect(() => {
		fetch(API_URL, {
			method: "POST",
			body: JSON.stringify({ query: STATS_QUERY }),
			headers: {
				Authorization: `Bearer ${TOKEN}`,
				"Content-Type": "application/json",
			},
		})
			.then((resp) => resp.json())
			.then((resp) => resp.data.heroStats.laneOutcome as LaneOutcome[])
			.then((laneOutcomes) => {
				let stats: LaneOutcome[] = [];
				for (const outcome of laneOutcomes) {
					const idx = stats.findIndex((o) => o.heroId1 === outcome.heroId1);
					if (idx !== -1) {
						for (const key in stats[idx]) {
							const field = key as keyof LaneOutcome;
							if (field === "heroId1") continue;

							stats[idx][field] += outcome[field];
						}
					} else {
						stats.push(outcome);
					}
				}

				setStats(stats);
			})
			.catch((err) => console.error(err));
	}, []);

	if (stats.length <= 0) {
		return <p>loading...</p>;
	}

	return (
		<main className="p-4">
			<div className="border-gray-700 border rounded overflow-hidden bg-gray-800 max-w-5xl mx-auto">
				<table className="w-full rounded">
					<thead>
						<tr>
							<th className="border-gray-700 border p-3 text-sm text-gray-400"></th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Hero</th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Got stomped %</th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Lost %</th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Won %</th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Stomped %</th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Matches</th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Rating</th>
						</tr>
					</thead>

					<tbody className="text-base">
						{stats
							.filter((s) => s.matchCount > 20000)
							.sort((s1, s2) => calculateLaneRating(s2) - calculateLaneRating(s1))
							.map((s, idx) => {
								const name = HEROES.find((h) => h.id === s.heroId1)!.displayName;
								return (
									<tr key={name}>
										<td className="border-gray-700 border p-3 text-sm text-gray-400 text-center">{idx + 1}</td>
										<th className="border-gray-700 border p-3 text-left">{name}</th>
										<td className="border-gray-700 border p-3 text-right">
											{Math.round((s.stompLossCount / s.matchCount) * 100)}%
										</td>
										<td className="border-gray-700 border p-3 text-right">
											{Math.round((s.lossCount / s.matchCount) * 100)}%
										</td>
										<td className="border-gray-700 border p-3 text-right">
											{Math.round((s.winCount / s.matchCount) * 100)}%
										</td>
										<td className="border-gray-700 border p-3 text-right">
											{Math.round((s.stompWinCount / s.matchCount) * 100)}%
										</td>
										<td className="border-gray-700 border p-3 text-right">{s.matchCount}</td>
										<td className="border-gray-700 border p-3 text-right font-bold">{calculateLaneRating(s)}</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</main>
	);
}

/**
 * Great - stomps
 * Good - wins
 *
 * Bad - losses
 *
 * With match count considered
 */
function calculateLaneRating({ lossCount, matchCount, winCount, stompWinCount, stompLossCount }: LaneOutcome): number {
	return Math.round(
		((stompWinCount * 4 + winCount - lossCount - stompLossCount * 4) / matchCount) * Math.log(matchCount) * 100
	);
}

/**
 * Tiers based by this rating:
 *
 * S - Huskar, Lone Druid, Viper
 * A - Dragon Knight, Outworld Destroyer, Arc Warden, Snapfire
 * B - Shadow Fiend, Lina, Timbersaw, Sniper
 */

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
        stompWinCount
      }
    }
  }
`;

type LaneOutcome = {
	heroId1: number;
	lossCount: number;
	matchCount: number;
	stompWinCount: number;
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
						stats[idx].lossCount += outcome.lossCount;
						stats[idx].matchCount += outcome.matchCount;
						stats[idx].stompWinCount += outcome.stompWinCount;
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
			<div className="border-gray-700 border rounded overflow-hidden bg-gray-800">
				<table className="w-full rounded">
					<thead>
						<tr>
							<th className="border-gray-700 border p-3 text-sm text-gray-400"></th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Hero</th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Stomped %</th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Matches</th>
						</tr>
					</thead>

					<tbody className="text-base">
						{stats
							.filter((s) => s.matchCount > 20000)
							.map((s) => ({
								...s,
								name: HEROES.find((h) => h.id === s.heroId1)!.displayName,
								winPercent: Math.round((s.stompWinCount / s.matchCount) * 100),
							}))
							.sort((s1, s2) => s2.winPercent - s1.winPercent)
							.map((s, idx) => (
								<tr key={s.name}>
									<td className="border-gray-700 border p-3 text-sm text-gray-400 text-center">{idx + 1}</td>
									<th className="border-gray-700 border p-3 text-left">{s.name}</th>
									<td className="border-gray-700 border p-3 text-right">{s.winPercent}%</td>
									<td className="border-gray-700 border p-3 text-right">{s.matchCount}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</main>
	);
}

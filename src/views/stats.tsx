import { useEffect, useState } from "react";
import { HEROES } from "../config";
import { LaneOutcome, fetchLaneOutcomes } from "../api";

export function Stats() {
	const [stats, setStats] = useState<LaneOutcome[]>([]);

	useEffect(() => {
		fetchLaneOutcomes()
			.then((stats) => setStats(stats))
			.catch((err) => console.error(err));
	}, []);

	if (stats.length <= 0) {
		return <p>loading...</p>;
	}

	return (
		<main className="p-2 md:p-4">
			<div className="border-gray-700 border rounded overflow-hidden bg-gray-800 max-w-5xl mx-auto">
				<table className="w-full rounded">
					<thead>
						<tr>
							<th className="hidden md:table-cell border-gray-700 border p-3 text-sm text-gray-400"></th>
							<th className="border-gray-700 border p-3 text-sm text-gray-400">Hero</th>
							<th className="hidden sm:table-cell border-gray-700 border p-3 text-sm text-red-500">LL</th>
							<th className="hidden sm:table-cell border-gray-700 border p-3 text-sm text-red-500">L</th>
							<th className="hidden sm:table-cell border-gray-700 border p-3 text-sm text-yellow-500">D</th>
							<th className="hidden sm:table-cell border-gray-700 border p-3 text-sm text-green-500">W</th>
							<th className="hidden sm:table-cell border-gray-700 border p-3 text-sm text-green-500">WW</th>
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
										<td className="hidden md:table-cell border-gray-700 border p-3 text-sm text-gray-400 text-center">
											{idx + 1}
										</td>
										<th className="border-gray-700 border p-3 text-left font-normal">{name}</th>
										<td className="hidden sm:table-cell border-gray-700 border p-3 text-right">
											{Math.round((s.stompLossCount / s.matchCount) * 100)}%
										</td>
										<td className="hidden sm:table-cell border-gray-700 border p-3 text-right">
											{Math.round((s.lossCount / s.matchCount) * 100)}%
										</td>
										<td className="hidden sm:table-cell border-gray-700 border p-3 text-right">
											{Math.round((s.drawCount / s.matchCount) * 100)}%
										</td>
										<td className="hidden sm:table-cell border-gray-700 border p-3 text-right">
											{Math.round((s.winCount / s.matchCount) * 100)}%
										</td>
										<td className="hidden sm:table-cell border-gray-700 border p-3 text-right">
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

import { HEROES } from "../config";
import { LaneOutcome, fetchLaneOutcomes } from "../api";
import { useQuery } from "@tanstack/react-query";

export function Stats() {
	const { isPending, isError, data: stats, error } = useQuery({ queryKey: ["stats"], queryFn: fetchLaneOutcomes });

	if (isPending) {
		return (
			<main className="flex h-full w-full items-center justify-center">
				<svg
					className="h-16 w-16 animate-spin text-gray-300"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			</main>
		);
	}

	if (isError) {
		return (
			<main className="flex h-full w-full items-center justify-center">
				<code>{error.message}</code>
			</main>
		);
	}

	return (
		<main className="p-2 md:p-4">
			<div className="mx-auto max-w-5xl overflow-hidden rounded border border-gray-700 bg-gray-800">
				<table className="w-full rounded">
					<thead>
						<tr>
							<th className="hidden border border-gray-700 p-3 text-sm text-gray-400 md:table-cell"></th>
							<th className="border border-gray-700 p-3 text-sm text-gray-400">Hero</th>
							<th className="hidden border border-gray-700 p-3 text-sm text-red-500 sm:table-cell">LL</th>
							<th className="hidden border border-gray-700 p-3 text-sm text-red-500 sm:table-cell">L</th>
							<th className="hidden border border-gray-700 p-3 text-sm text-yellow-500 sm:table-cell">D</th>
							<th className="hidden border border-gray-700 p-3 text-sm text-green-500 sm:table-cell">W</th>
							<th className="hidden border border-gray-700 p-3 text-sm text-green-500 sm:table-cell">WW</th>
							<th className="border border-gray-700 p-3 text-sm text-gray-400">Matches</th>
							<th className="border border-gray-700 p-3 text-sm text-gray-400">Rating</th>
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
										<td className="hidden border border-gray-700 p-3 text-center text-sm text-gray-400 md:table-cell">
											{idx + 1}
										</td>
										<th className="border border-gray-700 p-3 text-left font-normal">{name}</th>
										<td className="hidden border border-gray-700 p-3 text-right sm:table-cell">
											{Math.round((s.stompLossCount / s.matchCount) * 100)}%
										</td>
										<td className="hidden border border-gray-700 p-3 text-right sm:table-cell">
											{Math.round((s.lossCount / s.matchCount) * 100)}%
										</td>
										<td className="hidden border border-gray-700 p-3 text-right sm:table-cell">
											{Math.round((s.drawCount / s.matchCount) * 100)}%
										</td>
										<td className="hidden border border-gray-700 p-3 text-right sm:table-cell">
											{Math.round((s.winCount / s.matchCount) * 100)}%
										</td>
										<td className="hidden border border-gray-700 p-3 text-right sm:table-cell">
											{Math.round((s.stompWinCount / s.matchCount) * 100)}%
										</td>
										<td className="border border-gray-700 p-3 text-right">{s.matchCount}</td>
										<td className="border border-gray-700 p-3 text-right font-bold">{calculateLaneRating(s)}</td>
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
		((stompWinCount * 4 + winCount - lossCount - stompLossCount * 4) / matchCount) * Math.log(matchCount) * 100,
	);
}

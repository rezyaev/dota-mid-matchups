import { HEROES } from "../config";
import { LaneOutcome, fetchLaneOutcomes, fetchWinDays } from "../api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useLocalStorage } from "../lib/use-local-storage";

const MATCH_COUNT_KEY = 'MATCH_COUNT_KEY'
const MATCH_COUNT_DEFAULT_VALUE = '20000'

export function Stats() {
    const [matchCount, setMatchCount] = useLocalStorage(MATCH_COUNT_KEY, MATCH_COUNT_DEFAULT_VALUE)

    return (
        <main className="mx-auto flex max-w-5xl flex-col p-2 md:p-8">
            <h1 className="mb-8 text-center text-5xl font-bold">Midlane Statistics</h1>

            <div className="mb-4 flex flex-col gap-1">
                <label htmlFor="match-count" className="text-gray-400 text-sm">Match count</label>
                <input
                    inputMode="numeric"
                    id="match-count"
                    className="w-24 appearance-none rounded border border-gray-700 bg-gray-800 p-2 outline-blue-700 focus:outline outline-2 outline-offset-2"
                    min="0"
                    max={Number.MAX_SAFE_INTEGER}
                    value={matchCount}
                    onChange={(event) => setMatchCount(event.target.value)}
                />
            </div>

            <Suspense fallback={<Spinner />}>
                <Table matchCount={parseInt(matchCount)} />
            </Suspense>
        </main>
    );
}

function Table({ matchCount }: { matchCount: number }) {
    const { data } = useSuspenseQuery({ queryKey: ["stats"], queryFn: () => Promise.all([fetchLaneOutcomes(), fetchWinDays()]) });
    const [laneOutcomes, winDays] = data;

    return (
        <div className="overflow-hidden rounded border border-gray-700 bg-gray-800">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-400">
                        <th className="hidden border border-gray-700 p-3 md:table-cell"></th>
                        <th className="border border-gray-700 p-3 text-sm">Hero</th>
                        <th className="hidden border border-gray-700 p-3 text-red-500 sm:table-cell">LL</th>
                        <th className="hidden border border-gray-700 p-3 text-red-500 sm:table-cell">L</th>
                        <th className="hidden border border-gray-700 p-3 text-yellow-500 sm:table-cell">D</th>
                        <th className="hidden border border-gray-700 p-3 text-green-500 sm:table-cell">W</th>
                        <th className="hidden border border-gray-700 p-3 text-green-500 sm:table-cell">WW</th>
                        <th className="hidden border border-gray-700 p-3 sm:table-cell">MW</th>
                        <th className="border border-gray-700 p-3 text-sm">Matches</th>
                        <th className="border border-gray-700 p-3 text-sm">Rating</th>
                    </tr>
                </thead>

                <tbody className="text-base">
                    {laneOutcomes
                        .filter((s) => s.matchCount > matchCount)
                        .sort((s1, s2) => calculateRating(s2) - calculateRating(s1))
                        .map((s, idx) => {
                            const name = HEROES.find((h) => h.id === s.heroId1)!.displayName;

                            const winDay = winDays.find(d => d.heroId === s.heroId1);
                            if (!winDay) {
                                throw new Error(`winDay is not found for ${name}`)
                            }

                            return (
                                <tr key={name}>
                                    <td className="hidden border border-gray-700 p-3 text-center text-gray-400 md:table-cell">
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
                                    <td className="hidden border border-gray-700 p-3 text-right sm:table-cell">
                                        {Math.round((winDay.winCount / winDay.matchCount) * 100)}%
                                    </td>
                                    <td className="border border-gray-700 p-3 text-right">{s.matchCount}</td>
                                    <td className="border border-gray-700 p-3 text-right font-bold">{calculateRating(s)}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Great - stomps
 * Great - stomps
 * Good - wins
 *
 * Bad - losses
 *
 * With match count considered
 */
function calculateRating({ lossCount, matchCount, winCount, stompWinCount, stompLossCount }: LaneOutcome): number {
    return Math.round(
        ((stompWinCount * 4 + winCount - lossCount - stompLossCount * 4) / matchCount) * Math.log(matchCount) * 100,
    );
}

function Spinner() {
    return (
        <div className="py-32">
            <svg
                className="mx-auto h-16 w-16 animate-spin text-gray-300"
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
        </div>
    );
}


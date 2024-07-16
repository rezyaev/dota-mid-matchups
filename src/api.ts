const TOKEN =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiOGI0NDQyMWMtNDQwNy00YjlkLTllNGItNmExNzE2NzA4Y2EwIiwiU3RlYW1JZCI6IjEzNzM0MjE3OSIsIm5iZiI6MTcwMDcwMjQ0MywiZXhwIjoxNzMyMjM4NDQzLCJpYXQiOjE3MDA3MDI0NDMsImlzcyI6Imh0dHBzOi8vYXBpLnN0cmF0ei5jb20ifQ.zK1k2iTqZavSf02DiY0cQFWF6_ZgcF9-lfz8erPIdYA";
const API_URL = "https://api.stratz.com/graphql";
const HEADERS = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

export type LaneOutcome = {
	heroId1: number;
	heroId2: number;
	matchCount: number;
	lossCount: number;
	drawCount: number;
	winCount: number;
	stompWinCount: number;
	stompLossCount: number;
};

export async function fetchLaneOutcomesByHeroId(heroId: number) {
	const resp = await fetch(API_URL, {
		method: "POST",
		body: JSON.stringify({
			query: `
			{
				heroStats { 
					laneOutcome(isWith: false, positionIds: [POSITION_2], heroId: ${heroId}) {
						heroId1
						heroId2
						matchCount
						lossCount
						drawCount
						winCount
						stompWinCount
						stompLossCount
					}
				}
			}
		`,
		}),
		headers: HEADERS,
	}).then((r) => r.json());

	return resp.data.heroStats.laneOutcome as LaneOutcome[];
}

export async function fetchLaneOutcomes() {
	const resp = await fetch(API_URL, {
		method: "POST",
		body: JSON.stringify({
			query: `
			{
				heroStats { 
					laneOutcome(isWith: false, positionIds: [POSITION_2]) {
						heroId1
						heroId2
						matchCount
						lossCount
						drawCount
						winCount
						stompWinCount
						stompLossCount
					}
				}
			}
		`,
		}),
		headers: HEADERS,
	}).then((r) => r.json());

	const laneOutcomes = resp.data.heroStats.laneOutcome as LaneOutcome[];
	return mergeLaneOutcomes(laneOutcomes);
}

function mergeLaneOutcomes(outcomes: LaneOutcome[]) {
	const mergedOutcomes: LaneOutcome[] = [];

	for (const outcome of outcomes) {
		const idx = mergedOutcomes.findIndex((o) => o.heroId1 === outcome.heroId1);

		if (idx === -1) {
			mergedOutcomes.push(outcome);
			continue;
		}

		for (const key in mergedOutcomes[idx]) {
			const field = key as keyof LaneOutcome;
			if (field === "heroId1" || field === "heroId2") continue;

			mergedOutcomes[idx][field] += outcome[field];
		}
	}

	return mergedOutcomes;
}

export type WinDay = {
    day: number;
    heroId: number;
    winCount: number;
    matchCount: number
}

export async function fetchWinDays(): Promise<WinDay[]> {
	const resp = await fetch(API_URL, {
		method: "POST",
		body: JSON.stringify({
			query: `
			{
		        heroStats {
                    winDay(positionIds: [POSITION_2]) {
                        day
                        heroId
                        winCount
                        matchCount
                    }
                }	
			}
		`,
		}),
		headers: HEADERS,
	}).then((r) => r.json());

    return resp.data.heroStats.winDay as WinDay[];
}

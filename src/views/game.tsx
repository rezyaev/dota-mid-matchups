import { random } from "lodash-es";
import { HEROES, CDN_URL, Hero } from "../config";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLaneOutcomesByHeroId } from "../api";

export function Game() {
	const [hero1, setHero1] = useState<Hero | null>(null);
	const [hero2, setHero2] = useState<Hero | null>(null);

	const {
		isPending,
		isError,
		data: laneOutcome,
		error,
	} = useQuery({
		queryKey: ["matchup"],
		queryFn: async () => {
			const hero1 = HEROES[random(0, HEROES.length)];

			let hero2: Hero;
			do {
				hero2 = HEROES[random(0, HEROES.length)];
			} while (hero1 === hero2);

			setHero1(hero1);
			setHero2(hero2);

			const laneOutcomes = await fetchLaneOutcomesByHeroId(hero1.id);
			return laneOutcomes.find((o) => o.heroId1 === hero1.id && o.heroId2 === hero2.id);
		},
	});

	if (isPending) return "loading";
	if (isError) return error.message;

	console.log({ laneOutcome });

	return (
		<main className="relative flex h-full flex-col items-center gap-4 p-4">
			<HeroCard hero={hero1!.displayName} />
			<HeroCard hero={hero2!.displayName} />
		</main>
	);
}

function HeroCard({ hero }: { hero: string }) {
	const snakeCaseName = hero.toLowerCase().split(" ").join("_");

	return (
		<div className="relative w-full flex-1 overflow-hidden rounded-lg bg-gray-800 p-6 shadow">
			<h2 className="mb-4 text-4xl">{hero}</h2>
			<p className="text-8xl font-bold"></p>

			<img className="absolute -right-1/4 bottom-0" src={`${CDN_URL}/${snakeCaseName}.png`} />
		</div>
	);
}

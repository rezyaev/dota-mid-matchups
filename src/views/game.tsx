import { random } from "lodash-es";
import { HEROES, CDN_URL } from "../config";

export function Game() {
	const hero1 = HEROES[random(0, HEROES.length)];

	let hero2;
	do {
		hero2 = HEROES[random(0, HEROES.length)];
	} while (hero1 === hero2);

	return (
		<main className="relative flex h-full flex-col items-center gap-4 p-4">
			<HeroCard hero={hero1.displayName} />
			<HeroCard hero={hero2.displayName} />
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

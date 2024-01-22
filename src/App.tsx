import { random } from "lodash-es";
import "./App.css";
import { CDN_URL, HEROES } from "./config";

export default function App() {
	const hero1 = HEROES[random(0, HEROES.length)];

	let hero2;
	do {
		hero2 = HEROES[random(0, HEROES.length)];
	} while (hero1 === hero2);

	return (
		<main className="bg-gray-900 text-gray-300  relative h-full flex items-center flex-col gap-4 p-4">
			<HeroCard hero={hero1} />
			<HeroCard hero={hero2} />
		</main>
	);
}

function HeroCard({ hero }: { hero: string }) {
	const snakeCaseName = hero.toLowerCase().split(" ").join("_");

	return (
		<div className="relative flex-1 w-full shadow overflow-hidden p-6 rounded-lg bg-gray-800">
			<h2 className="text-4xl mb-4">{hero}</h2>
			<p className="text-8xl font-bold"></p>

			<img className="absolute -right-1/4 bottom-0" src={`${CDN_URL}/${snakeCaseName}.png`} />
		</div>
	);
}

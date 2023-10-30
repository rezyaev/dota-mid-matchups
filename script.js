import { HEROES, CDN_URL } from "./config.js";

const heroCard1 = document.getElementById("hero-card-1");
const heroCard2 = document.getElementById("hero-card-2");

let state = "pending";
let winrate1;
let winrate2;

document.addEventListener("DOMContentLoaded", async () => {
	await initMatchup();

	heroCard1.addEventListener("dblclick", () => displayWinner());
	heroCard2.addEventListener("dblclick", () => displayWinner());

	document.body.addEventListener("click", () => reset());
});

async function reset() {
	if (state !== "results") return;

	await initMatchup();

	heroCard1.classList.remove("winner", "loser");
	heroCard2.classList.remove("winner", "loser");

	state = "pending";
}

async function initMatchup() {
	const hero1 = HEROES[getRandomInt(0, HEROES.length)];

	let hero2;
	do {
		hero2 = HEROES[getRandomInt(0, HEROES.length)];
	} while (hero1 === hero2);

	const nameWinrateMap = await fetchNameWinrateMap(hero1);
	winrate1 = parseFloat(nameWinrateMap[hero2]);
	winrate2 = 100 - winrate1;

	displayHeroCard(hero1, winrate1, heroCard1);
	displayHeroCard(hero2, winrate2, heroCard2);
}

function displayWinner() {
	document.getElementById(`hero-card-${winrate1 > 50 ? 1 : 2}`).classList.add("winner");
	document.getElementById(`hero-card-${winrate1 > 50 ? 2 : 1}`).classList.add("loser");

	setTimeout(() => {
		state = "results";
	}, 100);
}

function displayHeroCard(hero, winrate, card) {
	card.querySelector("h2").textContent = hero;
	card.querySelector(".hero-winrate").textContent = `${Math.round(winrate)}%`;

	card.querySelector("img").alt = hero;

	const snakeCaseName = hero.toLowerCase().split(" ").join("_");
	card.querySelector("img").src = `${CDN_URL}/${snakeCaseName}.png`;
}

async function fetchNameWinrateMap(hero) {
	const kebabCaseName = hero.toLowerCase().split(" ").join("-");
	const resp = await fetch(`./data/${kebabCaseName}.json`);
	return resp.json();
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	// The maximum is exclusive and the minimum is inclusive
	return Math.floor(Math.random() * (max - min) + min);
}

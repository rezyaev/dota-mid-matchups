import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.42/deno-dom-wasm.ts";
import { Element } from "https://deno.land/x/deno_dom@v0.1.42/src/dom/element.ts";
import { HEROES } from "./config.js";

HEROES.forEach(async (hero) => {
	const kebabCaseName = hero.toLowerCase().split(" ").join("-");
	const resp = await fetch(`https://www.dotabuff.com/heroes/${kebabCaseName}/counters`);
	const page = await resp.text();

	const document = new DOMParser().parseFromString(page, "text/html");
	if (!document) {
		throw new Error("Document is null/undefined");
	}

	const heroNodes = document.querySelectorAll("[data-link-to]");
	if (!heroNodes || heroNodes.length === 0) {
		throw new Error("Hero nodes not found");
	}

	const result = Array.from(heroNodes).reduce((acc, row) => {
		const [nameNode, _, winrateNode] = Array.from((row as Element).querySelectorAll("[data-value]"));

		const name = (nameNode as Element).dataset.value;
		const winrate = (winrateNode as Element).dataset.value;

		if (!name || !winrate) {
			return acc;
		}

		return { ...acc, [name]: winrate };
	}, {});

	const file = await Deno.create(`./data/${kebabCaseName}.json`);
	await file.write(new TextEncoder().encode(JSON.stringify(result)));
});

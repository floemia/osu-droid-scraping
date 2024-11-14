import type { DroidMods, DroidScore, DroidScoreParameters, DroidUser, DroidUserParameters } from "../typings/index.d.ts";
/**
 * Given the `uid` of an osu!droid account, returns a `DroidUser` with all of their parsed info from `osu!droid.moe`.
 * 
 * Returns `undefined` if the user doesn't exist.
 *
 * @param {DroidScoreParameters} params - Parameters for osu!droid user fetching.
*/
const user = async (params: DroidUserParameters): Promise<DroidUser | undefined> => {
	let data = params.response ? params.response : await request(params.uid)
	if (!data) return undefined
	// get rid of unnecessary data
	data = data.split("<!--Top Plays-->")[0];

	/**
	 * `country_and_ranks[0]` - Country code.
	 * 
	 * `country_and_ranks[1]` - Score rank.
	 * 
	 * `country_and_ranks[2]` - DPP rank.
	 */
	const country_and_ranks = data.match(/(?<=<a>)(.*?)(?=<\/a>)/g)!
	const country = country_and_ranks.shift()!

	const ranks = country_and_ranks.map(x => Number(x.replace("#", "")))

	/**
	 * As of writing:
	 * 
	 * `tech_data[0]` - Ranked score.
	 * 
	 * `tech_data[1]` - DPP amount.
	 * 
	 * `tech_data[2]` - Hit accuracy.
	 * 
	 * `tech_data[3]` - Playcount.
	 */
	const tech_data = data.match(/(?<=<\/td> <td>)(.*?)(?=<\/td> <\/tr>)/g)!

	return {
		username: data.match(/(?<=15px; color: #EB2F96;">)(.*?)(?=<\/a>)/g)![0],
		avatar_url: `https://osudroid.moe/user/avatar/${data.match(/(?<=src=".\/user\/avatar\/)(.*?)(?=")/g)![0]}`,
		id: params.uid,
		rank: {
			score: ranks[0],
			dpp: ranks[1]
		},
		country: country,
		ranked_score: Number(tech_data[0].replace(/,/g, '')),
		dpp: Number(tech_data[1].replace(/,|pp/g, '')),
		accuracy: Number(tech_data[2].replace("%", '')),
		playcount: Number(tech_data[3]),
	}
}

/**
* Given the `uid` of an osu!droid account, returns the user's scores, parsed from `osudroid.moe`.
*
 * @param {DroidScoreParameters} params - Parameters for osu!droid user's scores fetching.
*/
const scores = async (params: DroidScoreParameters): Promise<DroidScore[] | undefined> => {
	let data = params.response ? params.response : await request(params.uid!)
	if (!data) return undefined

	if (data.includes("<h1>User not found.</h1>")) return undefined;
	const user = await droid.user!({ uid: params.uid, response: data })
	// delete unimportant data
	data = data.split("<!--Top Plays-->")[1]
		.split("Recent Plays</b>")[params.type == "recent" ? 1 : 0]

	const scores = data.match(/(?<=<a class="">)(.*?)(?=<\/span>)/g)
	if (!scores) return []
	if (params.limit && params.limit > 0 && scores.length > params.limit) scores.length = params.limit

	const scores_array: DroidScore[] = []

	for (const score of scores) {
		scores_array.push({
			title: score.match(/(?<=<strong class="">)(.*?)(?=<\/strong>)/g)![0],
			rank: score.match(/(?<=\/assets\/img\/ranking-)(.*?)(?=.png")/g)![0],
			score: Number(score.match(/(?<=score: )(.*?)(?= \/ )/g)![0].replace(/,/g, '')),
			timestamp: new Date(score.match(/(?<=style="margin-left: 50px;">)(.*?)(?= \/)/g)![0]).getTime(),
			dpp: Number(score.match(/(?<=pp:)(.*?)(?=\/)/g)![0]),
			mods: droid.mods(score.match(/(?<=mod:)(.*?)(?=\/)/g)![0].replace(/ |x/g, '').split(",")),
			accuracy: Number(score.match(/(?<=accuracy: )(.*?)(?=%)/g)![0]),
			combo: Number(score.match(/(?<=combo: )(.*?)(?= x)/g)![0]),
			misses: Number(score.match(/(?<=miss: )(.*?)(?=<)/g)![0]),
			hash: score.match(/(?<="hash":)(.*?)(?=})/g)![0],
			user: user!
		})
	}
	return scores_array
}


/**
* Given the `uid` of an osu!droid account, retrieves the HTML source code of the user's page from `osudroid.moe`.
*
* @param {number} uid - The UID of the osu!droid account.
*/
const request = async (uid: number): Promise<string | undefined> => {
	let data;
	const response = await fetch(`https://osudroid.moe/profile.php?uid=${uid}`)
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	data = await response.text()
	if (data.includes("<h1>User not found.</h1>")) return undefined
	// remove useless stuff
	return data.replace(/\n| +(?= )|> </g, '').split("<!--Avatar, Region, Rank-->")[1].split(`<footer class="footer">`)[0]
}

/**
 * Given an array of mods (full name), returns `DroidMods`.
 * 
 * It contains all of the mods' acronyms and the added speed rate multiplier.
 * 
 * @param {string[]} mods_arr - Array with mods with their respective full names `( [HardRock, Hidden, ...] )`.
 */
const mods = (mods_arr: string[]): DroidMods => {
	let mods: DroidMods = {
		acronyms: [],
		speed: 1.0,
	}
	for (const mod of mods_arr) {
		switch (mod.toLowerCase()) {
			case "easy": mods.acronyms.push("EZ"); break;
			case "nofail": mods.acronyms.push("NF"); break;
			case "halftime": mods.acronyms.push("HT"); break;
			case "hardrock": mods.acronyms.push("HR"); break;
			case "hidden": mods.acronyms.push("HD"); break;
			case "doubletime": mods.acronyms.push("DT"); break;
			case "nightcore": mods.acronyms.push("NC"); break;
			case "flashlight": mods.acronyms.push("FL"); break;
			case "suddendeath": mods.acronyms.push("SD"); break;
			case "perfect": mods.acronyms.push("PF"); break;
			case "precise": mods.acronyms.push("PR"); break;
			case "none": break;
			case "": break;
			default: mods.speed = Number(mod)
		}
	}
	return mods
}

/**
 * Core of the module. It contains all of the functions.
*/
export const droid = {
	/**
	 * Given the `uid` of an osu!droid account, returns a `DroidUser` with all of their parsed info from `osu!droid.moe`.
	 * 
	 * Returns `undefined` if the user doesn't exist.
	 *
	 * @param {DroidScoreParameters} params - Parameters for osu!droid user fetching.
	*/
	user,

	/**
	 * Given the `uid` of an osu!droid account, returns the user's scores, parsed from `osudroid.moe`.
	 *
	 * @param {DroidScoreParameters} params - Parameters for osu!droid user's scores fetching.
	*/
	scores,

	/**
	 * Given an array of mods (full name), returns `DroidMods`.
	 * 
	 * It contains all of the mods' acronyms and the added speed rate multiplier.
	 * 
	 * @param {string[]} mods_arr - Array with mods with their respective full names `( [HardRock, Hidden, ...] )`.
	*/
	mods,

	/**
	 * Given the `uid` of an osu!droid account, retrieves the HTML source code of the user's page from `osudroid.moe`.
	 * 
	 * Returns `undefined` if the user doesn't exist.
	 * @param {number} uid - The UID of the osu!droid account.
	*/
	request
}
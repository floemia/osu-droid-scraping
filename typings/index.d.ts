/**
 * An osu!droid user profile.
 *
 */
interface DroidUser {
	/**
	* The username of the account.
	**/

	username: string,

	/**
	* The URL of the user's avatar.
	**/
	avatar_url: string,

	/**
		* The UID of the account.
		**/
	id: number,

	/**
	* Contains the user's global ranks ( score | dpp ).
	**/
	rank: {
		/**
		* The user's score rank.
		**/
		score: number,

		/**
		* The user's DPP rank.
		**/
		dpp: number,
	},

	/**
	* The user's country code (ISO-3166-1 A-2).
	* 
	* https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
	**/
	country: string,

	/**
	* The user's total ranked score.
	**/
	ranked_score: number,

	/**
	* The user's total DPP (Droid Performance Points).
	**/
	dpp: number,

	/**
	* The user's hit accuracy.
	**/
	accuracy: number,

	/**
	* The user's total playcount.
	**/
	playcount: number
}

/**
* Parameters for osu!droid user fetching.
**/
interface DroidUserParameters {
	/**
	* UID of the osu!droid account.
	**/
	uid: number,

	/**
	* Optional. The HTML source code of the user's profile page. It's used to avoid unnecessary requests.
	**/
	response?: string,
}

/**
* An osu!droid score.
**/
interface DroidScore {
	/**
	* The default title of the beatmap.
	* 
	* It should only be used if needed, as it may contain typos. Use `hash` to find the beatmap instead.
	**/
	title: string,

	/**
	* The achieved rank of the score.
	* 
	* ( "XH" | "X" | "SH" | "S" | "A" | "B" | "C" | "D" )
	**/
	rank: string,

	/**
	* The total score obtained.
	**/
	score: number,

	/**
	* Unix timestamp of when the score was set.
	**/
	timestamp: number,

	/**
	* The total DPP obtained from this score.
	* 
	* It should only be used if needed. Please use this instead.
	* 
	* https://github.com/Rian8337/osu-droid-module/tree/master/packages/osu-difficulty-calculator
	**/
	dpp: number,

	/**
	* The hit accuracy from this score.
	**/
	accuracy: number,

	/**
	* The mods used in this score.
	**/
	mods: DroidMods,

	/**
	* The maximum combo obtained from this score.
	**/
	combo: number

	/**
	* The amount of misses from this score.
	**/
	misses: number,

	/**
	* The beatmap's MD5 checksum.
	* 
	* It can be used to obtain a beatmap using the osu! API.
	**/
	hash: string,

	/**
	* The author of this score.
	* 
	**/
	user: DroidUser,

}

/**
* Parameters for osu!droid score fetching.
**/
interface DroidScoreParameters {
	/**
	* UID of the osu!droid account.
	* 
	**/
	uid: number,

	/**
	* Optional. The HTML source code of the user's profile page. It's used to avoid unnecessary requests.
	**/
	response?: string,

	/**
	* Type of score to return.
	* 
	**/
	type: "recent" | "top"

	/**
	* Optional. Limit of scores to return `(1 <= x <= 50)`.
	* 
	* Defaults to 50.
	**/
	limit?: number,
}

/**
* An object containing a list of mods and the speed rate multiplier.
**/
interface DroidMods {
	/**
	* An array with abreviated mods.
	* 
	* `["HR", "HD", "DT", ...]` 
	* 
	* A No Mod play will return `[]`.
	**/
	acronyms: string[],

	/**
	* The speed rate applied on top of the mods.
	* 
	* `(1.75x) => speed: 1.25`
	* 
	* Defaults to `speed: 1`.
	**/
	speed: number,
}

export { DroidUser, DroidUserParameters, DroidScore, DroidScoreParameters, DroidMods }
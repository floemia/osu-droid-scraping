
# osu!droid web scraping

A small module that gathers information about an osu!droid user.

It retrieves the HTML source code from `https://osudroid.moe/profile.php?uid={uid}` and parses it. As expected, it may break whenever the page gets updated. I'll keep an eye on it and update this package if needed.

**Please, be responsible with the usage of this package.**




## Installation
```
> npm i osu-droid-scraping
```
## Usage
```js
// your_file.js or whatever

import { droid } from "osu-droid-scraping"
// or, if you're using CommonJS
const { droid } = require("osu-droid-scraping")

// retrieve the html source code first
const data = await droid.request(177955)

if (data) {
	const user = await droid.user({ response: data })
	const recent_scores = await droid.scores({ uid: 177955, type: "recent", response: data, limit: 30 })
	const top_plays = await droid.scores({ uid: 177955, type: "top", response: data, limit: 10 })
}

// - calling without passing the html -
//
// keep in mind that every call will make a request to osudroid.moe
// this is recommended ONLY IF you're going to call ONLY ONE function

const user = await droid.user({ uid: 177955 })
const recent_scores = await droid.scores({ uid: 177955, type: "recent" })

```

## Example output

```js
const user = await droid.user({ uid: 177955 })
// will return DroidUser
{
  username: 'MG_floemia',
  avatar_url: 'https://osudroid.moe/user/avatar/177955.png',
  id: 177955,
  rank: { score: 1502, dpp: 123 },
  country: 'PY',
  ranked_score: 4270092650,
  dpp: 8528,
  accuracy: 96.5,
  playcount: 622
}
```

```js
const top_plays = await droid.scores({ uid: 177955, type: "top", limit: 3 })
// will return DroidScore[]
[
    {
        title: 'THE ORAL CIGARETTES - Flower (Nevo) [Reflect',
        rank: 'SH',
        score: 34150840,
        timestamp: 1720731488000,
        dpp: 564,
        mods: {
            acronyms: [ 'HD', 'NC' ],
            speed: 1
        },
        accuracy: 99.24,
        combo: 1522,
        misses: 0,
        hash: '1539021f8567e814c78adf2fe3f466ff',
        user: {
            username: 'MG_floemia',
            avatar_url: 'https://osudroid.moe/user/avatar/177955.png',
            id: 177955,
            rank: { score: 1502, dpp: 123 },
            country: 'PY',
            ranked_score: 4270092650,
            dpp: 8528,
            accuracy: 96.5,
            playcount: 622
        }
    },
//... 2 more items
]
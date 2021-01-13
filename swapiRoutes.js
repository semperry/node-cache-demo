const router = require("express").Router();
const axios = require("axios");

let cachedData;
let cachedTime;

const apiKeys = new Map();
apiKeys.set("12345");

function checkKeys(req, res, next) {
	const key = req.get("X-API-KEY");

	if (apiKeys.has(key)) {
		next();
	} else {
		res.status(401).json({ message: "Invalid API Key" });
	}
}

function checkCache(req, res, next) {
	if (cachedData && cachedData[slug] && Date.now() < cachedTime + 10 * 1000) {
		return res.status(200).json({ ...cachedData[slug], fromCache: true });
	} else {
		next();
	}
}

router.get("/people/:slug", checkKeys, checkCache, (req, res) => {
	const { slug } = req.params;

	try {
		axios
			.get(`https://www.swapi.tech/api/people/${slug}`)
			.then((result) => {
				cachedData = { [slug]: result.data };
				cachedTime = Date.now();

				res.status(200).json({ ...result.data, fromCache: false });
			})
			.catch((err) => res.status(500).json({ errors: `${err}` }));
	} catch (err) {
		res.status(400).json({ errors: `${err}` });
	}
});

module.exports = router;

// This is a JS file where I will calculate the reading time of Chrome developer articles, and webstore pages

function renderReadingTime(article) {
	// If no article, don't render anything
	if (!article) {
		return;
	}

	const text = article.textContent;
	const wordMatchRegExp = /[^\s]+/g; // What is this?
	const words = text.matchAll(wordMatchRegExp); // ?
	// matchAll returns an iterator, convert to array to get word count 
	const wordCount = [...words].length; // ?
	const readingTime = Math.round(wordCount / 200); 
	const badge = document.createElement("p");
	// Use the same styling as the publish information in the article's header ??
	badge.classList.add("color-secondary-text", "type--caption"); //?
	badge.textContent = `⏱️ ${readingTime} min read`; //?

	


}


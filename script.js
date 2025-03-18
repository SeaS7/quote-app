// Storing quote history for navigation
let quotesHistory = [];
let currentQuoteIndex = -1;

// Fetching and displaying a new quote
async function getQuote() {
    const loader = document.getElementById("loader");
    // Showing loader while fetching
    loader.style.display = "block";

    try {
        // Fetching a random quote
        const quoteResponse = await fetch("https://api.freeapi.app/api/v1/public/quotes/quote/random");
        const quoteData = await quoteResponse.json();

        // Fetching a random background image
        const imgResponse = await fetch("https://picsum.photos/600/400");
        const imgUrl = imgResponse.url;

        // Creating a quote object
        const newQuote = {
            text: quoteData.data.content,
            author: "- " + quoteData.data.author,
            img: imgUrl,
        };

        // Storing quote and updating index
        quotesHistory.push(newQuote);
        currentQuoteIndex = quotesHistory.length - 1;

        displayQuote(newQuote);
        updateNavButtons();
    } catch (error) {
        console.log("Error fetching quote:", error);
    } finally {
        loader.style.display = "none"; // Hide loader after fetching
    }
}

// Displaing the given quote
function displayQuote(quote) {
    document.getElementById("quote").innerText = quote.text;
    document.getElementById("author").innerText = quote.author;
    document.getElementById("quote-img").src = quote.img;
}

// Coping quote text to clipboard
function copyQuote() {
    const quoteText = document.getElementById("quote").innerText + " " + document.getElementById("author").innerText;
    navigator.clipboard.writeText(quoteText);
    alert("Quote copied to clipboard!");
}

// Saving quote as an image
function saveImage() {
    const quoteContainer = document.getElementById("quote-container");

    html2canvas(quoteContainer, {
        backgroundColor: null,
        useCORS: true, // Prevent cross-origin issues to save image
    }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "quote.png";
        link.click();
    });
}

// Sharing quote on Twitter
function shareOnTwitter() {
    const quoteText = document.getElementById("quote").innerText + " " + document.getElementById("author").innerText;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`;
    window.open(tweetUrl, "_blank");
}

// Updating navigation buttons visibility
function updateNavButtons() {
    document.getElementById("prevBtn").style.display = currentQuoteIndex > 0 ? "block" : "none";
    document.getElementById("nextBtn").style.display = currentQuoteIndex < quotesHistory.length - 1 ? "block" : "none";
}

// Showing the previous quote
function prevQuote() {
    if (currentQuoteIndex > 0) {
        currentQuoteIndex--;
        displayQuote(quotesHistory[currentQuoteIndex]);
        updateNavButtons();
    }
}

// Showing the next quote
function nextQuote() {
    if (currentQuoteIndex < quotesHistory.length - 1) {
        currentQuoteIndex++;
        displayQuote(quotesHistory[currentQuoteIndex]);
        updateNavButtons();
    }
}

// Attaching event listeners
document.getElementById("newQuoteBtn").addEventListener("click", getQuote);
document.getElementById("copyBtn").addEventListener("click", copyQuote);
document.getElementById("saveBtn").addEventListener("click", saveImage);
document.getElementById("twitterBtn").addEventListener("click", shareOnTwitter);
document.getElementById("prevBtn").addEventListener("click", prevQuote);
document.getElementById("nextBtn").addEventListener("click", nextQuote);

// Loading the first quote on page load
getQuote();

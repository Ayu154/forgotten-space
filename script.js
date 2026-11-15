
/* =========================
   ARTIFACT FILTERING
========================= */

// Select filter buttons
const filterButtons =
    document.querySelectorAll(".filter-btn");

// Select artifact cards
const artifactCards =
    document.querySelectorAll(".artifact-card");


// Filter function
function filterArtifacts(destination) {

    artifactCards.forEach(card => {

        const cardDestination =
            card.dataset.destination;

        if (
            destination === "all" ||
            cardDestination === destination
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}


// Handle filter button clicks
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const destination =
            button.dataset.filter;

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        filterArtifacts(destination);

    });

});


/* =========================
   DESTINATION CARD CLICKS
========================= */

const destinationCards =
    document.querySelectorAll(".destination-card");

destinationCards.forEach(card => {

    card.addEventListener("click", () => {

        const destination =
            card.dataset.filter;

        filterArtifacts(destination);

        filterButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === destination
            );

        });

        document.querySelector("#artifacts")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* =========================
   NASA IMAGE API
========================= */

// NASA public image library
const NASA_API =
    "https://images-api.nasa.gov/search";


// Load images
async function loadNASAImages() {

    const imageContainers =
        document.querySelectorAll(
            "[data-nasa-search]"
        );

    for (const container of imageContainers) {

        const query =
            container.dataset.nasaSearch;

        try {

            const response = await fetch(
                `${NASA_API}?q=${encodeURIComponent(query)}&media_type=image&page_size=10`
            );

            if (!response.ok) {
                throw new Error("NASA API request failed");
            }

            const data = await response.json();

            const items =
                data.collection.items;

            if (!items || items.length === 0) {
                continue;
            }

            // Find a result with a preview image
            const imageItem = items.find(item =>

                item.links &&
                item.links.some(link =>
                    link.rel === "preview"
                )

            );

            if (!imageItem) {
                continue;
            }

            // Get image URL
            const imageURL =
                imageItem.links.find(
                    link => link.rel === "preview"
                ).href;

            // Create image element
            const image =
                document.createElement("img");

            image.src = imageURL;

            image.alt =
                query + " - NASA photograph";

            image.loading = "lazy";

            // Add image to website
            container.prepend(image);

        } catch (error) {

            console.error(
                "NASA image loading failed:",
                error
            );

        }

    }

}


// Start loading NASA images
loadNASAImages();


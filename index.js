// Set the cohort name
const COHORT = "2310-FSA-ET-WEB-PT-SF";
// Construct the API URL using the cohort name
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
// Initialize the state object with an empty array for events
const state = {
    events: [],
};

// Get a reference to the events list in the HTML
const eventsList = document.querySelector("#events");
// Get a reference to the form used for adding events
const addEventForm = document.querySelector("#addEvent");
// Attach an event listener to the form for handling form submissions
addEventForm.addEventListener("submit", addEvent);

// Function to render the events
async function render() {
    // Fetch events from the API and render them
    await getEvents();
    renderEvents();
}
// Initial rendering when the page loads
render();

// Function to fetch events from the API and update the state
async function getEvents() {
    try {
        // Fetch events from the API
        const response = await fetch(API_URL);
        // Parse the JSON response
        const json = await response.json();
        // Update the state with the fetched events
        state.events = json.data;
    } catch (error) {
        // Log any errors that occur during the fetch
        console.log(error);
    }
}

// Function to render the events in the HTML
async function renderEvents() {
    // Log the events to the console
    console.log(state.events);
    // If there are no events, display a message in the events list
    if (!state.events.length) {
        eventsList.innerHTML = "<li>No events.</li>";
        return;
    }

    // Create list items for each event and append a delete button to each
    const eventsCards = state.events.map((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h2>Name: ${event.name}</h2>
            <p>Location: ${event.location}</p>
            <p>Date: ${event.date}</p>
            <p>Description: ${event.description}</p>
        `;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        
        // Set the type attribute of the delete button to "button"
        deleteButton.type = "button";
        
        // Attach an event listener to the delete button for handling deletions
        deleteButton.addEventListener("click", async () => {
            await deleteEvent(event.id);
            getEvents();
        }); 
        li.append(deleteButton);
        return li;
    });
    // Replace the existing content of the events list with the new list items
    eventsList.replaceChildren(...eventsCards);
}

// Function to add a new event
async function addEvent(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    try {
        // Fetch to add a new event to the API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: event.target.name.value,
                location: event.target.location.value,
                date: event.target.date.value + ":00.000Z",
                description: event.target.description.value,
            }),
        });
        // Parse the JSON response
        const result = await response.json();
        // Log the result to the console
        console.log(result);

        // If the response is not okay, throw an error
        if (!response.ok) {
            throw new Error("Failed to create new event");
        }

        // Render the events after a successful addition
        render();
    } catch (error) {
        // Log any errors that occur during the addition
        console.log(error);
    }
}

// Function to delete an event
async function deleteEvent(id) {
    try {
        // Fetch to delete an event from the API
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        // Wait for the deletion to complete before fetching events
        await getEvents();
        // Render the events after fetching
        renderEvents();
    } catch (error) {
        // Log any errors that occur during the deletion
        console.log(error);
    }
}

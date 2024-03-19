const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const state = {};

const cohortName = '2401-FTB-WEB-AM';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};

const renderAllPlayers = (playerList) => {
    try {
        // Implement rendering logic here
        const playersDiv = document.getElementById('players');
        playersDiv.innerHTML = ''; // Clear previous content

        playerList.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.innerHTML = `
                <h2>${player.name}</h2>
                <p>Breed: ${player.breed}</p>
                <p>Status: ${player.status}</p>
                <img src="${player.imageUrl}" alt="${player.name}">
                <button onclick="deletePlayer(${player.id})">Delete</button>
            `;
            playersDiv.appendChild(playerDiv);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderNewPlayerForm = () => {
    try {
        // Implement rendering logic for new player form here
        // You can render the form wherever you want
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

const init = async () => {
    try {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);

        renderNewPlayerForm();
    } catch (err) {
        console.error('Oops, something went wrong during initialization!', err);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Function to fetch and display players
        const fetchPlayers = async () => {
            try {
                const response = await fetch(APIURL);
                const { data } = await response.json();
                renderAllPlayers(data.players);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        // Function to add a new player
        const addPlayer = async (event) => {
            event.preventDefault();
            const form = document.getElementById('addPlayerForm');
            const formData = new FormData(form);
            const playerData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(APIURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(playerData),
                });
                const { data } = await response.json();
                console.log('New player added:', data.newPlayer);
                form.reset(); // Clear form fields after successful submission
                fetchPlayers(); // Refresh player list
            } catch (error) {
                console.error('Error adding player:', error);
            }
        };

        // Function to delete a player
        window.deletePlayer = async (playerId) => {
            try {
                const response = await fetch(`${APIURL}/${playerId}`, {
                    method: 'DELETE',
                });
                const { success } = await response.json();
                if (success) {
                    console.log('Player deleted successfully');
                    fetchPlayers(); // Refresh player list
                } else {
                    console.error('Failed to delete player');
                }
            } catch (error) {
                console.error('Error deleting player:', error);
            }
        };

        // Fetch and display players when the page loads
        fetchPlayers();

        // Add event listener for form submission
        const addPlayerForm = document.getElementById('addPlayerForm');
        addPlayerForm.addEventListener('submit', addPlayer);
    } catch (err) {
        console.error('Oops, something went wrong during initialization!', err);
    }
});

const cohortName = '2401-FTB-ET-WEB-AM';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const { data } = await response.json();
        return data.players || []; // Ensure a default value if data.players is undefined
    } catch (err) {
        console.error('Error fetching players:', err);
        return [];
    }
};

const renderPlayerDetails = (playerDetails, playerDiv) => {
    const existingDetailsContainer = playerDiv.querySelector('.details-container');
    if (existingDetailsContainer) {
        existingDetailsContainer.remove();
    } else {
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details-container');

        const { breed, status } = playerDetails;

        const breedParagraph = document.createElement('p');
        breedParagraph.textContent = `Breed: ${breed}`;

        const statusParagraph = document.createElement('p');
        statusParagraph.textContent = `Status: ${status}`;

        detailsContainer.appendChild(breedParagraph);
        detailsContainer.appendChild(statusParagraph);

        playerDiv.appendChild(detailsContainer);
    }
};

const renderPlayerCard = (player) => {
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player');

    const { name, breed, status, imageUrl } = player;

    const playerName = document.createElement('h2');
    playerName.textContent = name;

    const breedParagraph = document.createElement('p');
    breedParagraph.textContent = `Breed: ${breed}`;

    const statusParagraph = document.createElement('p');
    statusParagraph.textContent = `Status: ${status}`;

    const playerImage = document.createElement('img');
    playerImage.src = imageUrl;
    playerImage.alt = name;

    const showDetailsButton = document.createElement('button');
    showDetailsButton.textContent = 'Show Details';
    showDetailsButton.addEventListener('click', () => {
        renderPlayerDetails(player, playerDiv);
    });

    playerDiv.appendChild(playerName);
    playerDiv.appendChild(breedParagraph);
    playerDiv.appendChild(statusParagraph);
    playerDiv.appendChild(playerImage);
    playerDiv.appendChild(showDetailsButton);

    return playerDiv;
};

const renderAllPlayers = async () => {
    try {
        const allPlayersContainer = document.getElementById('all-players-container');
        allPlayersContainer.innerHTML = ''; // Clear previous content

        const players = await fetchAllPlayers();
        players.forEach(player => {
            const playerCard = renderPlayerCard(player);
            allPlayersContainer.appendChild(playerCard);
        });
    } catch (err) {
        console.error('Error rendering all players:', err);
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
        console.error('Error adding new player:', err);
    }
};

const init = async () => {
    try {
        await renderAllPlayers();
    } catch (err) {
        console.error('Initialization error:', err);
    }
};

document.addEventListener('DOMContentLoaded', init);

const addPlayerForm = document.getElementById('addPlayerForm');
addPlayerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const breed = document.getElementById('breed').value;
    const imageUrl = document.getElementById('imageUrl').value;

    const newPlayer = {
        name,
        breed,
        imageUrl,
        status: 'field', // Assuming the new player is always in the field status
    };

    await addNewPlayer(newPlayer);
    await renderAllPlayers(); // Refresh the list of players after adding a new one
    addPlayerForm.reset(); // Reset the form fields after submission
});

const cohortName = '2401-FTB-WEB-AM';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const { data } = await response.json();
        return data.players; // Extracting the player list from the response data
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
        return []; // Return an empty array in case of error
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

const deletePlayer = async (playerId) => {
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
        const playersDiv = document.getElementById('players');
        playersDiv.innerHTML = ''; // Clear previous content

        playerList.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');

            const playerName = document.createElement('h2');
            playerName.textContent = player.name;

            const breedParagraph = document.createElement('p');
            breedParagraph.textContent = `Breed: ${player.breed}`;

            const statusParagraph = document.createElement('p');
            statusParagraph.textContent = `Status: ${player.status}`;

            const playerImage = document.createElement('img');
            playerImage.src = player.imageUrl;
            playerImage.alt = player.name;

            const showDetailsButton = document.createElement('button');
            showDetailsButton.textContent = 'Show Details';
            showDetailsButton.addEventListener('click', async () => {
                const playerDetails = await fetchPlayerDetails(player.id);
                renderPlayerDetails(playerDetails);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                await deletePlayer(player.id);
                const updatedPlayers = await fetchAllPlayers();
                renderAllPlayers(updatedPlayers); // Refresh player list after deletion
            });

            playerDiv.appendChild(playerName);
            playerDiv.appendChild(breedParagraph);
            playerDiv.appendChild(statusParagraph);
            playerDiv.appendChild(playerImage);
            playerDiv.appendChild(showDetailsButton);

            const detailsContainer = document.createElement('div');
            detailsContainer.classList.add('details-container');
            playerDiv.appendChild(detailsContainer);

            detailsContainer.appendChild(deleteButton); // Move delete button into the details container

            playersDiv.appendChild(playerDiv);
        });
    } catch (err) {
        console.error('Error rendering players:', err);
    }
};

const fetchPlayerDetails = async (playerId) => {
    try {
        const playerDetails = await fetchSinglePlayer(playerId);
        return playerDetails;
    } catch (err) {
        console.error('Error fetching player details:', err);
    }
};

const renderPlayerDetails = (playerDetails) => {
    // Implement rendering player details logic here
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

document.addEventListener('DOMContentLoaded', init);

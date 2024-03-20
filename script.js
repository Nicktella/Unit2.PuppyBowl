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
                const playerDetails = await fetchSinglePlayer(player.id);
                renderPlayerDetails(playerDetails, playerDiv);
            });

            playerDiv.appendChild(playerName);
            playerDiv.appendChild(breedParagraph);
            playerDiv.appendChild(statusParagraph);
            playerDiv.appendChild(playerImage);
            playerDiv.appendChild(showDetailsButton);

            playersDiv.appendChild(playerDiv);
        });
    } catch (err) {
        console.error('Error rendering players:', err);
    }
};

const renderPlayerDetails = (playerDetails, playerDiv) => {
    const existingDetailsContainer = playerDiv.querySelector('.details-container');
    if (existingDetailsContainer) {
        existingDetailsContainer.remove();
    } else {
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details-container');

        const breedParagraph = document.createElement('p');
        breedParagraph.textContent = `Breed: ${playerDetails.breed}`;

        const statusParagraph = document.createElement('p');
        statusParagraph.textContent = `Status: ${playerDetails.status}`;

        detailsContainer.appendChild(breedParagraph);
        detailsContainer.appendChild(statusParagraph);

        playerDiv.appendChild(detailsContainer);
    }
};

const init = async () => {
    try {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
    } catch (err) {
        console.error('Oops, something went wrong during initialization!', err);
    }
};

document.addEventListener('DOMContentLoaded', init);

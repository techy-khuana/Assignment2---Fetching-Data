/* 
<tr>
  <td>ALBUM NAME HERE</td>
  <td>RELEASE DATE HERE</td>
  <td>ARTIST NAME HERE</td>
  <td>GENRE HERE</td>
  <td>AVERAGE RATING HERE</td>
  <td>NUMBER OF RATINGS HERE</td>
</tr> 
*/

let store;

// Define async function to load album data
async function loadAlbumData() {
  const response = await fetch("public/data/albums.json");
  store = await response.json();
  console.log("Album data:", store); // Log the fetched data

  renderAlbums(store);
}

// Function to search albums by artist or artistName
function searchByArtistOrName(searchTerm) {
  const searchTermLower = searchTerm.toLowerCase();

  console.log("Search Term:", searchTermLower);

  // Filter albums based on search term
  const matchingAlbums = store.filter((album) => {
    console.log("Album:", album); // Log the album object

    // Ensure all album properties are converted to lowercase before comparison
    const albumNameLower = album.album.toLowerCase();
    const artistLower = album.artist ? album.artist.toLowerCase() : null;
    const artistNameLower = album.artistName
      ? album.artistName.toLowerCase()
      : null;

    return (
      albumNameLower.includes(searchTermLower) ||
      (artistLower && artistLower.includes(searchTermLower)) ||
      (artistNameLower && artistNameLower.includes(searchTermLower))
    );
  });

  console.log("Matching Albums:", matchingAlbums); // Log the matching albums array

  renderAlbums(matchingAlbums);

  return matchingAlbums;
}

// Function to search albums by minimum rating
function searchByRating(minRating) {
  const matchingAlbums = store.filter((album) => {
    return album.averageRating >= minRating;
  });

  return matchingAlbums.length > 0 ? matchingAlbums : null;
}

// Define renderAlbums function
function renderAlbums(albums) {
  const albumTableBody = document.querySelector("#album-rows");

  // Clear existing table rows
  albumTableBody.innerHTML = "";

  // Loop through each album and create a table row for it
  albums.forEach((album) => {
    const row = document.createElement("tr");

    // Populate table cells with album information
    row.innerHTML = `
      <td>${album.album}</td>
      <td>${album.releaseDate}</td>
      <td>${album.artistName}</td>
      <td>${album.genres}</td>
      <td>${album.averageRating}</td>
      <td>${album.numberReviews}</td>
    `;

    // Append the row to the table body
    albumTableBody.appendChild(row);
  });
}

// Call the function to load album data
loadAlbumData();

// Add an event listener to the form
const form = document.querySelector("#album-search-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Retrieve the value of the search query input
  const searchQuery = document
    .querySelector("#search-input")
    .value.trim()
    .toLowerCase();
  const minRating = parseFloat(
    document.querySelector("#min-album-rating-input").value
  );

  // Filter albums by name
  const filteredByArtistOrName = searchByArtistOrName(searchQuery);

  // Filter albums by minimum rating
  const filteredByMinRating = searchByRating(minRating);

  // Check if both filtered results are valid before combining
  if (filteredByArtistOrName && filteredByMinRating) {
    const combinedFilteredAlbums = filteredByArtistOrName.filter((album) =>
      filteredByMinRating.includes(album)
    );

    // Render the combined filtered albums
    renderAlbums(combinedFilteredAlbums);
  }
});

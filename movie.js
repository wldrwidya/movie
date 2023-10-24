const apiKey = '34894b2dffc606a0f360c0c91adba2db'

// get all movie genres
const genres = {};

$
.get('https://api.themoviedb.org/3/genre/movie/list', {
    api_key: apiKey
})
.done((response) => {
    response.genres.forEach((g) => {
        genres[g.id] = g.name;
    });

    console.log(genres);
})
.fail((error) => {
    alert(error.status_message);
});

function createTableRow(movie){
    const row = $('<tr></tr>');

    //  row number
    const number = $('#result > tr').length + 1;
    const columnNumber = $('<td width="10"></td>');
    columnNumber.append($('<h2 class="display-5"></h2>')).text(number);
    row.append(columnNumber);

    // poster
    const posterUrl = (movie.posterUrl !== null)
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '';
    const columnPoster = $('<td width="100"></td>');
    columnPoster.append($(`<img src="${posterUrl}" height="200">`));
    row.append(columnPoster);

    // movie information
    const columnInformation = $('<td></td>');
    row.append(columnInformation);

    // movie information - title
    const title = $('<h2 class="display-5"></h2>').text(movie.title);
    columnInformation.append(title);

    // movie information - overview
    const overview = $('<p></p>').text(movie.overview);
    columnInformation.append(overview);

    // rating 
    const rating = $('<span class="badge badge-success p-2"></span>').text(`Rating: ${movie.vote_average}`);
    columnInformation.append(rating);

    // genres
    movie.genre_ids.forEach((id) => {
        const genre = $('<span class="badge badge-warning ml-2 p-2"></span>').text(genres[id]);
        columnInformation.append(genre);
    });

    return row;
}

// search movie when the button is clicked
$('#searchButton').click((event) => {
    // clear error message
    $('#error').text('');

    // disabled search button
    $('#searchButton')
        .empty()
        .attr('disabled', 'disabled')
        .append($('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'))
        .append(' Loading...');
    
    // clear all pervious results from the table
    $('#result').empty();

    // send GET request
    $
    .get('https://api.themoviedb.org/3/search/movie', {
        api_key: apiKey,
        query: $('#title').val(), 
        include_adult: false
    })
    .done((response) => {
        if (response.results.length === 0) {
            $('#error').text('!!! No movie with this title.');
        }else{
            response.results.forEach((movie) => {
                const tableRow = createTableRow(movie);
                $('#result').append(tableRow);
            });
        }
    })
    .fail((error) => {
        $('#error').text(`!!! ${error.status_message}`);
    })
    .always(() => {
        // re-enable the search button
        $('#searchButton')
            .empty()
            .removeAttr('disabled')
            .append('Search');
    });
});
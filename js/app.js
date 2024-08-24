const apikey = '85c36847b0824547b09be916bb261e75';
const main = document.querySelector('#main');
const q = document.querySelector('#q');
const search = document.querySelector('#form');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSrouce = 'bbc-news';



window.addEventListener('load', async e => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSrouce;

    sourceSelector.addEventListener('change', e => {
        updateNews(e.target.value);

    });

    if ("serviceWorker" in navigator) {
        try {

            navigator.serviceWorker.register('sw.js');
            console.log('Sw registered');
        } catch (e) {

            console.log('Sw unregistered');

        }
    }
    // TODO: add search func   
    search.addEventListener('submit', e => {
        e.preventDefault();
        Search(q.value);
    });
    q.addEventListener('keypress', e => {
        e = e || window.event;
        var charCode = e.keyCode || e.which;
        if (charCode === 13) {
            Search(q.value);
        }
    });

});

/**
 * Gets a list of news sources from the News API
 * and adds them as options to the source selector
 * dropdown.
 */
async function updateSources() {
    // Get a list of news sources from the News API
    const res = await fetch(`https://newsapi.org/v1/sources`);

    // Get the JSON response and store it in the `json` variable
    const json = await res.json();

    // Create an array of HTML strings, each representing an option
    // for the source selector dropdown. The value of each option is
    // set to the ID of the news source, and the text of each option is
    // set to the name of the news source.
    const options = json.sources.map(src => `<option tabindex="0" value="${src.id}">${src.name}</option>`);

    // Join the array of HTML strings with newline characters
    // to create a single string of HTML.
    const optionsHTML = options.join('\n');

    // Set the innerHTML of the source selector to the HTML
    // string we just created.
    sourceSelector.innerHTML = optionsHTML;
}


/**
 * Fetches news articles from the News API and renders them to the page.
 *
 * If a `source` parameter is provided, it is used to fetch articles from
 * the specified news source. Otherwise, the default source is used.
 *
 * @param {string} [source] - The ID of the news source to fetch articles
 *  from. If not specified, the default source is used.
 */
async function updateNews(source = defaultSrouce) {

    // Fetch the articles from the News API. The URL is composed of the
    // News API endpoint URL, the source ID, and the API key.
    const res = await fetch(`https://newsapi.org/v1/articles?source=${source}&apikey=${apikey}`);

    // Parse the response as JSON.
    const json = await res.json();

    // Create an array of HTML strings, each representing an article. The
    // `map` method is used to iterate over the articles and call the
    // `createArticle` function on each one. The resulting array of HTML
    // strings is then joined with newline characters to create a single
    // string of HTML.
    const html = json.articles.map(createArticle).join("\n");

    // Set the innerHTML of the `main` element to the HTML string we just
    // created. This will render the news articles to the page.
    main.innerHTML = html;

}

async function Search(q) {
    const res = await fetch(`https://newsapi.org/v2/everything?q=${q}&apiKey=${apikey}`);
    const json = await res.json();
    main.innerHTML = json.articles.map(createArticle).join("\n");
}
function createArticle(article) {
    const img = article.urlToImage || window.location.href + '/images/No_Image_Available.jpg';
    const author = article.author || 'author';
    return `
        <div class="col-sm-4">
            <div class="tr-section">
                <div class="tr-post">
                    <div class="entry-header">
                        <div class="entry-thumbnail">
                            <a tabindex="0" href="${article.url}" target="_blank">
                                <img class="img-fluid" src="${img}" alt="${article.title}">
                            </a>
                        </div>
                        <!-- /entry-thumbnail -->
                    </div>
                    <!-- /entry-header -->
                    <div class="post-content">
                        <div class="author-post">
                            <a href="#"><img class="img-fluid rounded-circle" src="images/user.png" alt="${author}"></a>
                        </div>
                        <!-- /author -->
                        <div class="entry-meta">
                            <ul>
                                <li tabindex="0"><a href="#">${author}</a></li>
                                <li tabindex="0">${new Date(article.publishedAt).toLocaleDateString()}</li>
                            </ul>
                        </div>
                        <!-- /.entry-meta -->
                        <h2 tabindex="0">
                            <a href="${article.url}" target="_blank" class="entry-title">${article.title}</a>
                        </h2>
                        <p tabindex="0">${article.description}</p>
                        <div class="read-more">
                            <div class="continue-reading pull-right">
                                <a href="${article.url}" target="_blank">Continue Reading <i class="fa fa-angle-right"></i></a>
                            </div>
                            <!-- /continue-reading -->
                        </div>
                        <!-- /read-more -->
                    </div>
                    <!-- /.post-content -->
                </div>
                <!-- /.tr-post -->
            </div>
            <!-- /.tr-section -->
        </div>
        <!-- /col-sm-4 -->
    `;
}


$(document).ready(function() {
    /*============================================
    Scroll To Top
    ==============================================*/

    //When distance from top = 250px fade button in/out
    $(window).scroll(function() {
        if ($(this).scrollTop() > 250) {
            $('#scrollup').fadeIn(300);
        } else {
            $('#scrollup').fadeOut(300);
        }
    });

    //On click scroll to top of page t = 1000ms
    $('#scrollup').click(function() {
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
    });

});
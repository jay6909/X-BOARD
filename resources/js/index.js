const rssLinks = [
  "https://flipboard.com/topic/politics.rss",
  "https://flipboard.com/@thenewsdesk/the-latest-on-coronavirus-covid-19-t82no8kmz.rss",
  "https://flipboard.com/@dfletcher/india-tech-b2meqpd6z.rss",
];

async function init() {
  const newsData = await getNewsDataFromRss();
  rederInDom(newsData);
}

async function getNewsDataFromRss() {
  let newsData = await Promise.all(
    rssLinks.map((link, idx) => {
      return fetchNews(link);
    })
  );
  return newsData;
}

async function fetchNews(rssLink) {
  let data = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${rssLink}`
  );
  let json = await data.json();
  return json;
}

async function rederInDom(newsData) {
  const accordionSection = document.getElementById("accordionID");

  newsData.forEach((newsType, index) => {
    const accordionItem = document.createElement("div");

    accordionItem.innerHTML = `<h2 class="accordion-header" id="heading_${index}">
    <button
      class="accordion-button collapsed"
      type="button"
      data-mdb-toggle="collapse"
      data-mdb-target="#collapse_${index}"
      aria-expanded="false"
      aria-controls="collapse_${index}"
    >
    <h5 class="h5">${newsType.feed.title}</h5>
    </button>
  </h2>
  <div
    id="collapse_${index}"
    class="accordion-collapse collapse"
    aria-labelledby="heading_${index}"
    data-mdb-parent="#accordionID"
  >
    <div id="accordion-body_${index}" class="accordion-body">
      
    </div>
  </div>`;

    if (index == 0) {
      accordionItem.innerHTML = `
        <h2 class="accordion-header" id="heading_${index}"></h2>
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapse_${index}"
          aria-expanded="true"
          aria-controls="collapse_${index}"
        >
        <h5 class="h5">${newsType.feed.title}</h5>
        </button>
        <div
          id="collapse_${index}"
          class="accordion-collapse collapse show"
          aria-labelledby="heading_${index}"
          data-bs-parent="#accordionID"
        >
          <div id="accordion-body_${index}"  class="accordion-body">
            
          </div>
        </div>`;
    }
    accordionSection.appendChild(accordionItem);

    // let newsItem=newsType['items']

    createAccordionBody(index, newsType["items"]);
  });
}


function createAccordionBody(index, newsItem) {
  const accordion_body = document.getElementById(`accordion-body_${index}`);

  const {carousel,buttonPrev,buttonNext} = createCarouselOuter(index);

  const carouselInner = document.createElement("div");
  carouselInner.className = "carousel-inner";

  newsItem.map((news, idx) => {
    const carouselItem = document.createElement("div");
    const { enclosure, title, link, pubDate, author, content } = { ...news };
    const publishDate = getDate(pubDate);

    carouselItem.className = "carousel-item";

    carouselItem.innerHTML = `
      <a href="${link}"><img class="d-block w-100"
        src="${enclosure.link}"
        
        alt="..."
      />
      </a>
      <div class="my-2 news-heading-section">
      <h3 class="news-heading">${title}</h3>
      <div style="gap: 10px; align-items: center;" class="d-flex flex-row h6">${author} <div style="background: #586069;width:5px;height:5px; border-radius:50%"></div> ${publishDate}</div>
      </div>
      
      <p>${content}</P>
    `;
    if (idx == 0) {
      carouselItem.className = "carousel-item active";
    }
    carouselInner.appendChild(carouselItem);
  });
  carousel.append(carouselInner, buttonPrev, buttonNext);
  accordion_body.append(carousel);
}



function createCarouselOuter(index) {
  const carousel = document.createElement("div");

  carousel.className = "carousel slide";
  carousel.id = `newsCarousel_${index}`;
  carousel.setAttribute("data-mdb-ride", "carousel");

  const buttonPrev = document.createElement("button");
  const buttonNext = document.createElement("button");

  buttonPrev.className = "carousel-control-prev";
  buttonPrev.setAttribute("data-mdb-target", `#newsCarousel_${index}`);
  buttonPrev.setAttribute("data-mdb-slide", "prev");

  buttonPrev.innerHTML = `<span class="carousel-control-prev-icon" aria-hidden="true"></span>
  <span class="visually-hidden">Previous</span>`;

  buttonNext.className = "carousel-control-next";
  buttonNext.setAttribute("data-mdb-target", `#newsCarousel_${index}`);
  buttonNext.setAttribute("data-mdb-slide", "next");

  buttonNext.innerHTML = `<span class="carousel-control-next-icon" aria-hidden="true"></span>
  <span class="visually-hidden">Next</span>`;
  return {carousel, buttonPrev,buttonNext};
}

function getDate(pubDate) {
  const dateArr = pubDate.split(" ")[0].split("-");
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
}
export { init };

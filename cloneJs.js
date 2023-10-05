let allJobs;

window.addEventListener("load", async () => {
  allJobs = await getProfiles();
});

const searchBar = document.querySelector(".search-input");
const bubblesArea = document.querySelector(".bubbles-area");
const clearBtn = document.querySelector(".clear-btn");
const cardsContainer = document.querySelector(".main-container");
const searchTerms = new Set();
const searchCategories = ["role", "level", "languages", "tools"];

clearBtn.addEventListener("click", () => {
  bubblesArea.innerHTML = "";
  cardsContainer.innerHTML = "";
  searchBar.value = "";
  searchTerms.clear();
});

searchBar.addEventListener("keypress", async function (event) {
  const searchTerm = searchBar.value.trim();
  if (
    event.key == "Enter" &&
    searchTerm &&
    !searchTerms.has(searchTerm.toLowerCase())
  ) {
    searchTerms.add(searchTerm.toLowerCase());
    const filterResult = await filterSearch(searchTerms);

    if (filterResult > 0) {
      createBubble(searchTerm);
      cardsContainer.querySelector(".no-match")?.remove();
    } else {
      createBubble(searchTerm);
      clearCards();
      cardsContainer.querySelector(".no-match")?.remove();
      const noMatch = document.createElement("p");
      noMatch.textContent = "No Match Found!";
      noMatch.classList.add("no-match");
      cardsContainer.prepend(noMatch);
      filterSearch(searchTerms);
    }

    searchBar.value = "";
  }
});

const getProfiles = async () => {
  const res = await fetch("./data.json");
  const data = await res.json();
  return data;
};

const createBubble = function (searchTerm) {
  const bubble = document.createElement("p");
  bubble.textContent = searchTerm;
  bubble.addEventListener("click", () => removeBubble(searchTerm, bubble));
  bubblesArea.appendChild(bubble);
  return bubblesArea;
};

const clearCards = () => {
  const cards = cardsContainer.querySelectorAll(".cards");
  for (const card of cards) {
    card.remove();
  }
};

const removeBubble = async (searchTerm, bubble) => {
  searchTerms.delete(searchTerm.toLowerCase());
  bubble.remove();
  if (searchTerms.size) {
    (await filterSearch(searchTerms)) &&
      cardsContainer.querySelector(".no-match")?.remove();
  } else {
    clearCards();
    cardsContainer.querySelector(".no-match")?.remove();
  }
};

const addTag = (tag) => {
  const searchTerm = tag.textContent;
  if (!searchTerms.has(searchTerm.toLowerCase())) {
    searchTerms.add(searchTerm.toLowerCase());
    createBubble(searchTerm);
    filterSearch(searchTerms);
  }
};

const filterSearch = async (searchTerms) => {
  const jobs = allJobs.filter((job) => {
    const jobsData = [
      job.role.toLowerCase(),
      job.level.toLowerCase(),
      ...job.languages.map((ele) => ele.toLowerCase()),
      ...job.tools.map((ele) => ele.toLowerCase()),
    ];
    const filterResult = [...searchTerms].every((ele) =>
      jobsData.includes(ele)
    );
    return filterResult;
  });
  clearCards();

  jobs.forEach((ele) => {
    createCards(ele);
  });

  return jobs.length;
};

const getCardTerms = (cardData) => {
  let categories = [];

  searchCategories.forEach((category) => {
    if (typeof cardData[category] === "string") {
      categories.push(cardData[category]);
    } else if (cardData[category].length) {
      categories = categories.concat(cardData[category]);
    }
  });

  return categories;
};

const createCards = (ele) => {
  const card = document.createElement("div");
  const dataBox = document.createElement("div");
  const cardImageContainer = document.createElement("div");
  const cardImage = document.createElement("img");
  const cardInfo = document.createElement("div");
  const companyInfo = document.createElement("div");
  const companyName = document.createElement("div");
  const newTag = document.createElement("div");
  const featuredTag = document.createElement("div");
  const positionInfo = document.createElement("div");
  const jobInfo = document.createElement("div");
  const postDate = document.createElement("div");
  const contractType = document.createElement("div");
  const locationInfo = document.createElement("div");
  const tagsBox = document.createElement("div");

  cardImage.src = ele["logo"];
  companyName.textContent = ele["company"];
  positionInfo.textContent = ele["position"];
  contractType.textContent = ele["contract"];
  postDate.textContent = ele["postedAt"];
  locationInfo.textContent = ele["location"];

  for (const category of searchCategories) {
    if (ele[category] && typeof ele[category] === "string") {
      const tag = document.createElement("p");
      tag.addEventListener("click", () => addTag(tag));
      tag.textContent = ele[category];
      tagsBox.appendChild(tag);
    } else {
      const tagsArray = ele[category];
      tagsArray.forEach((element) => {
        const tag = document.createElement("p");
        tag.textContent = element;
        tag.addEventListener("click", () => addTag(tag));
        tagsBox.appendChild(tag);
      });
    }
  }

  companyInfo.appendChild(companyName);
  if (ele["new"] === true) {
    newTag.textContent = "New!";
    companyInfo.appendChild(newTag);
  }
  if (ele["featured"] === true) {
    featuredTag.textContent = "Featured";
    companyInfo.appendChild(featuredTag);
  }

  cardImageContainer.appendChild(cardImage);

  jobInfo.appendChild(postDate);
  jobInfo.appendChild(contractType);
  jobInfo.appendChild(locationInfo);

  cardInfo.appendChild(companyInfo);
  cardInfo.appendChild(positionInfo);
  cardInfo.appendChild(jobInfo);

  dataBox.appendChild(cardImageContainer);
  dataBox.appendChild(cardInfo);

  card.appendChild(dataBox);
  card.appendChild(tagsBox);
  cardsContainer.appendChild(card);

  companyName.classList.add("company-name");
  newTag.classList.add("new-tag");
  featuredTag.classList.add("featured-tag");
  cardImageContainer.classList.add("card-image");
  companyInfo.classList.add("company-info");
  postDate.classList.add("post-date");
  contractType.classList.add("contract-type");
  locationInfo.classList.add("location-info");
  jobInfo.classList.add("job-info");
  companyInfo.classList.add("company-info");
  positionInfo.classList.add("position-info");
  cardInfo.classList.add("card-info");
  dataBox.classList.add("data-box");
  tagsBox.classList.add("tags-box");
  card.classList.add("cards");
};

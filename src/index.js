import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import { Notify } from "notiflix";
import SlimSelect from "slim-select";
import "slim-select/dist/slimselect.css";

const breedSelect = document.querySelector(".breed-select");

const loader = document.querySelector(".loader");

const errorText = document.querySelector(".error");
errorText.classList.add("visually-hidden");

const catInfo = document.querySelector(".cat-info");

const select = new SlimSelect({
    select: breedSelect,
    settings: {
        disabled: false,
        alwaysOpen: false,
        showSearch: true,
        searchPlaceholder: "Search",
        searchText: "No Results",
        searchingText: "Searching...",
        searchHighlight: false,
        closeOnSelect: true,
        contentLocation: document.body,
        contentPosition: "absolute",
        openPosition: "auto",
        placeholderText: "Select cat",
        allowDeselect: false,
        hideSelected: false,
        showOptionTooltips: false,
    },
    events: {
        afterChange: newVal => {
            const breedId = newVal[0].value;
            if (breedId.length > 0) {
                requestStart();
                removeChildren(catInfo);
                fetchCatByBreed(breedId)
                    .then(cats => renderCats(cats))
                    .catch(error => handleFetchError(error));
            } else {
                catInfo.classList.add("visually-hidden");
            }
        },
    },
});

document.addEventListener("DOMContentLoaded", () => {
    requestStart();
    fetchBreeds()
        .then(breeds => renderBreeds(breeds))
        .catch(error => handleFetchError(error));
});

const renderBreeds = cats => {
    const arrSelected = [{ text: "", placeholder: true }, ...cats.map(cat => ({ text: cat.name, value: cat.id }))];
    select.setData(arrSelected);
    requestFinish();
};

const renderCats = cats => {
    if (cats.length > 0) {
        const markup = cats.map(cat => `
            <div class="cat-item-card">
                <img class="cat-img" src="${cat.url}" />
            </div>
            <div class="cat-item-card">
                <h1 class="cat-title">${cat.breeds[0].name}</h1>
                <p>${cat.breeds[0].temperament}</p>
                <p>${cat.breeds[0].description}</p>
            </div>`
        ).join("");

        catInfo.insertAdjacentHTML("afterbegin", markup);
    } else {
        Notify.failure(`${errorText.textContent}`);
    }

    requestFinish();
};

const handleFetchError = error => {
    error = Notify.failure(`${errorText.textContent}`);
    requestWrong();
};

const removeChildren = container => {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

const requestStart = () => {
    loader.classList.remove("visually-hidden");
    breedSelect.classList.add("visually-hidden");
    catInfo.classList.add("visually-hidden");
};

const requestFinish = () => {
    loader.classList.add("visually-hidden");
    breedSelect.classList.remove("visually-hidden");
    catInfo.classList.remove("visually-hidden");
};

const requestWrong = () => {
    loader.classList.add("visually-hidden");
    breedSelect.classList.add("visually-hidden");
    catInfo.classList.add("visually-hidden");
};

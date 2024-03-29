//Burger
const iconMenu = document.querySelector(".menu__icon");
if (iconMenu) {
  const menuBody = document.querySelector(".menu__body");
  iconMenu.addEventListener("click", function (e) {
    document.body.classList.toggle("_lock");
    iconMenu.classList.toggle("_active");
    menuBody.classList.toggle("_active");
  });
}
//Burger

//GoTo

const menuLinks = document.querySelectorAll(".menu__link[data-goto]");
if (menuLinks.length > 0) {
  menuLinks.forEach((menuLink) => {
    menuLink.addEventListener("click", onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const menuLink = e.target;
    if (
      menuLink.dataset.goto &&
      document.querySelector(menuLink.dataset.goto)
    ) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      const gotoBlockValue =
        gotoBlock.getBoundingClientRect().top +
        pageYOffset -
        document.querySelector("header").offsetHeight;

      window.scrollTo({
        top: gotoBlockValue,
        behavior: "smooth",
      });
      e.preventDefault();
      //menuLinks.classList.toggle('_active');
    }
  }
}
//GoTo

//Accordion

function Accordion(element, accIndex = 1) {
  element.classList.add("ready");
  const panelHeadings = element.querySelectorAll(".panel-heading");
  const panelContent = element.querySelectorAll(".panel-content");

  let activePanel = null;
  let activePanelIndex = -1;
  let verticalPadding = 15;

  const activatePanel = (index) => {
    panelHeadings[index].setAttribute("aria-expanded", "true");
    panelHeadings[index].classList.add("active");
    panelContent[index].style.height =
      panelContent[index].scrollHeight + verticalPadding * 2 + "px";
    panelContent[index].style.padding = `${verticalPadding}px 18px`;
  };

  const resetPanel = (index) => {
    panelHeadings[index].setAttribute("aria-expanded", "false");
    panelHeadings[index].classList.remove("active");
    panelContent[index].style.height = "0px";
    panelContent[index].style.padding = "0px";
  };

  const togglePanel = (index) => {
    const panel = panelHeadings[index];

    if (panel !== activePanel) {
      requestAnimationFrame(() => {
        resetPanel(activePanelIndex);

        activatePanel(index);

        activePanel = panel;
        activePanelIndex = index;
      });
    }
  };

  panelHeadings.forEach((panel, index) => {
    const panelId = `accordion-${accIndex}-${index}`;
    const panelContentId = `accordion-panel-${accIndex}-${index}`;

    requestAnimationFrame(() => {
      resetPanel(index);
      panel.id = panelId;
      panel.setAttribute("tabIndex", "0");
      panel.setAttribute("aria-controls", panelContentId);

      panelContent[index].id = panelContentId;
      panelContent[index].setAttribute("aria-labelledby", panelId);
      panelContent[index].setAttribute("role", "region");

      if (index === 1) {
        activePanel = panel;
        activePanelIndex = index;
        activatePanel(index);
      }
    });

    panel.addEventListener("click", () => togglePanel(index));
    panel.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        togglePanel(index);
      }
    });
  });
}

const accordions = document.querySelectorAll(".accordion");

accordions.forEach((acc, accIndex) => new Accordion(acc, accIndex));

//Accordion

//Slider

const slider = (function () {
  const slider = document.getElementById("slider");
  console.log(slider);
  const sliderContent = document.querySelector(".slider-content");
  console.log(sliderContent);
  const sliderWrapper = document.querySelector(".slider-content-wrapper");
  const elements = document.querySelectorAll(".slider-content__item");
  const sliderContentControls = createHTMLElement(
    "div",
    "slider-content__controls"
  );
  let dotsWrapper = null;
  let prevButton = null;
  let nextButton = null;
  let autoButton = null;
  let leftArrow = null;
  let rightArrow = null;
  let intervalId = null;

  const itemsInfo = {
    offset: 0,
    position: {
      current: 0,
      min: 0,
      max: elements.length - 1,
    },
    intervalSpeed: 2000,

    update: function (value) {
      this.position.current = value;
      this.offset = -value;
    },
    reset: function () {
      this.position.current = 0;
      this.offset = 0;
    },
  };

  const controlsInfo = {
    buttonsEnabled: false,
    dotsEnabled: false,
    prevButtonDisabled: true,
    nextButtonDisabled: false,
  };

  function init(props) {
    let { intervalSpeed, position, offset } = itemsInfo;

    if (slider && sliderContent && sliderWrapper && elements) {
      if (props && props.intervalSpeed) {
        intervalSpeed = props.intervalSpeed;
      }
      if (props && props.currentItem) {
        if (
          parseInt(props.currentItem) >= position.min &&
          parseInt(props.currentItem) <= position.max
        ) {
          position.current = props.currentItem;
          offset = -props.currentItem;
        }
      }
      if (props && props.buttons) {
        controlsInfo.buttonsEnabled = true;
      }
      if (props && props.dots) {
        controlsInfo.dotsEnabled = true;
      }

      _updateControlsInfo();
      _createControls(controlsInfo.dotsEnabled, controlsInfo.buttonsEnabled);
      _render();
    }
  }

  function _updateControlsInfo() {
    const { current, min, max } = itemsInfo.position;
    controlsInfo.prevButtonDisabled = current > min ? false : true;
    controlsInfo.nextButtonDisabled = current < max ? false : true;
  }

  function _createControls(dots = false, buttons = false) {
    sliderContent.append(sliderContentControls);

    createArrows();
    buttons ? createButtons() : null;
    dots ? createDots() : null;

    function createArrows() {
      const dValueLeftArrow =
        "M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z";
      const dValueRightArrow =
        "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z";
      const leftArrowSVG = createSVG(dValueLeftArrow);
      const rightArrowSVG = createSVG(dValueRightArrow);

      leftArrow = createHTMLElement("div", "prev-arrow");
      leftArrow.append(leftArrowSVG);
      leftArrow.addEventListener("click", () =>
        updateItemsInfo(itemsInfo.position.current - 1)
      );

      rightArrow = createHTMLElement("div", "next-arrow");
      rightArrow.append(rightArrowSVG);
      rightArrow.addEventListener("click", () =>
        updateItemsInfo(itemsInfo.position.current + 1)
      );

      sliderContentControls.append(leftArrow, rightArrow);

      function createSVG(dValue, color = "currentColor") {
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("viewBox", "0 0 256 512");
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("fill", color);
        path.setAttribute("d", dValue);
        svg.appendChild(path);
        return svg;
      }
    }

    // Dots function
    function createDots() {
      dotsWrapper = createHTMLElement("div", "dots");
      for (let i = 0; i < itemsInfo.position.max + 1; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.addEventListener("click", function () {
          updateItemsInfo(i);
        });
        dotsWrapper.append(dot);
      }
      sliderContentControls.append(dotsWrapper);
    }

    // Buttons function
    function createButtons() {
      const controlsWrapper = createHTMLElement("div", "slider-controls");
      prevButton = createHTMLElement("button", "prev-control", "Prev");
      prevButton.addEventListener("click", () =>
        updateItemsInfo(itemsInfo.position.current - 1)
      );

      autoButton = createHTMLElement("button", "auto-control", "Auto");
      autoButton.addEventListener("click", () => {
        intervalId = setInterval(function () {
          if (itemsInfo.position.current < itemsInfo.position.max) {
            itemsInfo.update(itemsInfo.position.current + 1);
          } else {
            itemsInfo.reset();
          }
          _slideItem();
        }, itemsInfo.intervalSpeed);
      });

      nextButton = createHTMLElement("button", "next-control", "Next");
      nextButton.addEventListener("click", () =>
        updateItemsInfo(itemsInfo.position.current + 1)
      );

      controlsWrapper.append(prevButton, autoButton, nextButton);
      slider.append(controlsWrapper);
    }
  }

  function setClass(options) {
    if (options) {
      options.forEach(({ element, className, disabled }) => {
        if (element) {
          disabled
            ? element.classList.add(className)
            : element.classList.remove(className);
        }
      });
    }
  }

  function updateItemsInfo(value) {
    itemsInfo.update(value);
    _slideItem(true);
  }

  function _render() {
    const { prevButtonDisabled, nextButtonDisabled } = controlsInfo;
    let controlsArray = [
      { element: leftArrow, className: "d-none", disabled: prevButtonDisabled },
      {
        element: rightArrow,
        className: "d-none",
        disabled: nextButtonDisabled,
      },
    ];
    if (controlsInfo.buttonsEnabled) {
      controlsArray = [
        ...controlsArray,
        {
          element: prevButton,
          className: "disabled",
          disabled: prevButtonDisabled,
        },
        {
          element: nextButton,
          className: "disabled",
          disabled: nextButtonDisabled,
        },
      ];
    }

    setClass(controlsArray);

    sliderWrapper.style.transform = `translateX(${itemsInfo.offset * 100}%)`;

    if (controlsInfo.dotsEnabled) {
      if (document.querySelector(".dot--active")) {
        document.querySelector(".dot--active").classList.remove("dot--active");
      }
      dotsWrapper.children[itemsInfo.position.current].classList.add(
        "dot--active"
      );
    }
  }

  function _slideItem(autoMode = false) {
    if (autoMode && intervalId) {
      clearInterval(intervalId);
    }
    _updateControlsInfo();
    _render();
  }

  function createHTMLElement(tagName = "div", className, innerHTML) {
    const element = document.createElement(tagName);
    className ? (element.className = className) : null;
    innerHTML ? (element.innerHTML = innerHTML) : null;
    return element;
  }

  return { init };
})();

slider.init({
  // intervalSpeed: 1000,
  currentItem: 0,
  buttons: false,
  dots: true,
});

//Slider

//popUp

function popUpNumber() {
  let popupNumber = document.getElementById("PopupNumber");
  popupNumber.classList.toggle("_show");
}
function popUpEmail() {
  let popupEmail = document.getElementById("PopupEmail");
  popupEmail.classList.toggle("_show");
}
function popUpLocation() {
  let popupLocation = document.getElementById("PopupLocation");
  popupLocation.classList.toggle("_show");
}
//popUp

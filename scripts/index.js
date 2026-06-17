(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll("[data-select]").forEach((select) => {
    const trigger = select.querySelector(".custom-select__trigger");
    const text = select.querySelector(".custom-select__text");
    const triggerFlag = trigger.querySelector(".custom-select__flag");
    const input = select.querySelector("input");
    const options = select.querySelectorAll(".custom-select__option");
    trigger.addEventListener("click", () => {
      select.classList.toggle("open");
    });
    options.forEach((option) => {
      option.addEventListener("click", () => {
        const optionText = option.textContent.trim();
        const optionFlag = option.querySelector(".custom-select__flag");
        text.textContent = optionText;
        input.value = option.dataset.value;
        triggerFlag.className = optionFlag.className;
        select.classList.remove("open");
      });
    });
    document.addEventListener("click", (event) => {
      if (!select.contains(event.target)) {
        select.classList.remove("open");
      }
    });
  });
});

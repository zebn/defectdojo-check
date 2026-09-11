// Intentional vulnerable fixture for CodeQL and DefectDojo training.
// This file is not loaded by index.html.
const userControlledValue = window.location.hash.slice(1);
document.body.innerHTML = userControlledValue;
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var products = null;

document.querySelector("#product").addEventListener("change", (e) => {
    // Clear current components options
    var components = document.querySelector("#component");
    components.innerHTML = "";

    var new_components = products[e.target.value];
    for (var component of new_components) {
        var new_component = document.createElement('option');
        new_component.value = component;
        new_component.innerHTML = component;
        components.appendChild(new_component);
    }
});

document.querySelector("#submit").addEventListener("click", (e) => {
    // Use sendMessage to send options background.js 
    if (document.querySelector("#new").checked) {
        var sending = browser.runtime.sendMessage({
            type: "new",
            product: document.querySelector("#product").value,
            component: document.querySelector("#component").value
        });
    } else {
        var sending = browser.runtime.sendMessage({
            type: "seealso",
            bugnumber: document.querySelector("#bugnumber").value
        });
    }

    // Close the popup window
    window.close();
});

function handleResponse(message) {
    products = JSON.parse(message.response);
    var elProducts = document.querySelector("#product");
    elProducts.innerHTML = "";
    for (var product in products) {
        var new_product = document.createElement('option');
        new_product.value = product;
        new_product.innerHTML = product;
        elProducts.appendChild(new_product);
    }
    // unselect to make sure we have product/component updated
    elProducts.selectedIndex = -1;
}

window.addEventListener("load", (e) => {
    var sending = browser.runtime.sendMessage({
        type: "request"
    });
    sending.then(handleResponse);
});
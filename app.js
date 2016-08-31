var app = {
    controllers: {
        GameController:null
    },
    models: {
        Entity:null,
        Service:null,
        Client:null,
        Master:null,
        Game: null,
        MasterLevels:null
    },
    views: {

    },
    utils: {
        extend:null
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    init();
});

function init() {
    var controlsContainer = document.createElement("div");
    var infoContainer = document.createElement("div");
    controlsContainer.setAttribute("id", "controls");
    infoContainer.setAttribute("id", "info");
    document.body.appendChild(controlsContainer);
    document.body.appendChild(infoContainer);
    var buttonsNames = ["Add Master", "Add Client", "Restart", "Stop"];
    for (var i = 0; i < buttonsNames.length; i++)
    {
        controlsContainer.appendChild(createButton(buttonsNames[i]));
    }

    function createButton(name){
        var element;
        element = document.createElement("input");
        element.setAttribute("type", "button");
        element.setAttribute("value", name);
        element.setAttribute("data-action", name.toLowerCase().split(" ").join("_"));
        return element;
    }

    app.controllers.GameController.create();
}

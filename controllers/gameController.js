/**
 * Created by alexa on 21.08.2016.
 */
function GameController() {
    var self = this,
        randomGenerator = new RandomGenerator(),
        gameModel = null,
        gameView = null,
        lastLoopTime,
        prevTickTime;
    var getRandomPlace = randomGenerator.getRandomUniqueMasterPlace();
    this.timerId = 0;
    this.create = function() {
        gameModel = app.models.Game;
        resources.onReady(initGame);
        resources.load(GameConstants.SERVICES_IMAGES.concat(GameConstants.BACK_IMG_URL));

    };

    this.addClient = function ()
    {
        var clients = gameModel.getNewClients();
        if (clients.length >= GameConstants.CLIENTS_MAX_COUNT)
        return;
        generateClientToCompany();
    };

    this.addMaster = function(){
        var masters = gameModel.getMasters();
        if (masters.length >= GameConstants.MASTERS_MAX_COUNT)
        {
            alert("Can not create masters. Create new salon");
            return;
        }
        if (masters.length > 0)
        {
            var id = masters[masters.length - 1].id + 1;
            var services = gameModel.getServices();
            var master = createMaster(id, services);
            gameModel.appendMaster(master);
        }

    };

    var runClientGeneration = function()
    {
        var delay = rand(15*GameConstants.TICK_TIME, 30*GameConstants.TICK_TIME);
        self.timerId = setInterval(generateClientToCompany, delay);
    };

    function initGame(){
        console.log("Init Games");
        var startServices = createServices(GameConstants.START_GAME_SERVICES);
        gameModel.setServices(startServices);
        console.log(gameModel.getServices());
        var startMasters = createMasters(GameConstants.START_GAME_MASTERS, startServices);
        gameModel.setMasters(startMasters);
        console.log(gameModel.getMasters());
        gameView = new GameView(self);
        gameView.startGame();

        runClientGeneration();

        nextStep();
    }

    function generateClientToCompany(){
        gameModel.appendClient(generateClient());
        console.log("generated Client");
    }

    function createServices(count){
        var newObj,
            list = [],
            autoincrement = counter(),
            randomName = randomGenerator.getRandomUniqueService();
        for (var i = 0; i < count; i++)
        {
            autoincrement.increment();
            newObj = new Service(autoincrement.value(), null, rand(100,300), rand(3000, 9000));
            newObj.name = randomName();
            console.log(newObj.name);
            list.push(newObj);
        }
        return list;
    }

    function createMaster(id, servicesList){
        var master, services, place;
        services = getRandomEntityIdsSubArray(servicesList, Math.max(Math.floor(Math.random()*3),1));
        master = new Master(id,null, services, app.models.MasterLevels.getRandomLevel());
        master.name = randomGenerator.getRandomPeopleName();
        place = getRandomPlace();
        master.posX = place[0];
        master.posY = place[1];
        return master;
    }
    function createMasters(count, servicesList){
        var newObj,
            list = [],
            autoincrement = counter();
        for (var i = 0; i < count; i++)
        {
            autoincrement.increment();
            newObj = createMaster(autoincrement.value(), servicesList);
            list.push(newObj);
        }
        return list;
    }

    function generateClient(){
        var autoincrement = counter();
        autoincrement.increment();
        var service = gameModel.getRandomService();
        var client = new Client(autoincrement.value(),null, service.id, rand(0,3));
        client.name = client.getStringName() + client.id;
        return client;
    }
    function updateDataGame(dt){

        var newClients = gameModel.getNewClients();
        var mastersList = gameModel.getMasters();

        if (newClients.length >= GameConstants.CLIENTS_MAX_COUNT)
        {
            clearInterval(self.timerId);
            self.timerId = null;
        }
        else if (!self.timerId)
        {
            runClientGeneration();
        }

        if (newClients.length > 0){
            var masterModel,
                masters,
                clientModel,
                mastersDict,
                serviceModel,
                randIndex,
                i;
            for (i=0; i < newClients.length; i++)
            {
                clientModel = newClients[i];
                masters = gameModel.getAvailableMastersByService(clientModel.service);
                if (masters.length > 0)
                {
                    mastersDict = filterMastersByComplexity(masters);
                    serviceModel = gameModel.getServiceById(clientModel.service);
                    if (mastersDict.hasOwnProperty(clientModel.complexity) && mastersDict[clientModel.complexity].length > 0){
                        var list = mastersDict[clientModel.complexity];
                        randIndex = rand(0, list.length - 1);
                        masterModel = list[randIndex];
                    }
                    else
                    {
                        randIndex = rand(0, masters.length - 1);
                        masterModel = masters[randIndex];
                    }
                    masterModel.isAvailable = false;
                    masterModel.currentService = clientModel.service;
                    masterModel.duration = (serviceModel.duration * clientModel.complexity) / masterModel.level;
                    clientModel.inProgress = true;
                    clientModel.priceToPay = serviceModel.getPrice() * (masterModel.level + clientModel.complexity);
                    clientModel.masterId = masterModel.id;
                }
                else
                {
                    clientModel.isWait = true;
                }

            }
        }

        for (i = 0; i< mastersList.length; i++)
        {
            if (!mastersList[i].isAvailable)
            {
                mastersList[i].loopService+=dt;

                if (mastersList[i].loopService >= mastersList[i].duration)
                {
                    console.log("AVAILABLE" + mastersList[i].id);
                    mastersList[i].loopService = 0;
                    mastersList[i].duration = 0;
                    mastersList[i].isAvailable = true;
                    serviceIsReady(mastersList[i].id);
                }
            }
        }

        function serviceIsReady(id) {
            var clients = gameModel.getInProgressClients();
            for (var i=0; i < clients.length; i++){
                if (clients[i].masterId == id)
                {

                    clients[i].isActive = false;
                    clients[i].inProgress = false;
                    clients[i].isWait = false;
                    gameModel.updateBalance(clients[i].priceToPay);

                }
            }
            var str = "Balance = " + gameModel.getBalance() + "<br>" + "New Clients: " + newClients.length;
            gameView.updateInfoContainer(str);
        }

        function filterMastersByComplexity(list){
            var obj = {};
            var key;
            for (var i = 0; i < list.length; i++)
            {
                key = list[i].level;
                if (!obj.hasOwnProperty(key))
                    obj[key] = [];

                obj[key].push(list[i]);
            }
            return obj;
        }
    }

    function renderGame(){
        gameView.updateCanvas();
        gameView.drawBackground();
        var masters = gameModel.getMasters();
        gameView.renderEntities(masters);
    }

    function updateGame(dt)
    {
        if (prevTickTime < GameConstants.TICK_TIME)
        {
            prevTickTime += dt;
        }
        else
        {
            prevTickTime = 0;
            updateDataGame(dt);
        }


    }
    /**
     * Game Step
     */
    function nextStep() {
        var now = Date.now();
        var dt = (now - lastLoopTime);
        updateGame(dt);
        renderGame();
        lastLoopTime = now;
        requestAnimationFrame(nextStep);
    }

}

GameController.prototype.resetGame = function()
{

};
GameController.prototype.stopGame = function()
{

};
app.controllers.GameController = new GameController();
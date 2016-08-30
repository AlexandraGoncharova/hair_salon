/**
 * Created by alexa on 21.08.2016.
 */
function GameController() {
    var self = this,
        randomGenerator = new RandomGenerator(),
        gameModel = null,
        gameView = null,
        lastLoopTime;

    this.create = function() {
        gameModel = app.models.Game;
        //gameModel.updateBalance(GameConstants.START_GAME_BALANCE);
        resources.onReady(initGame);
        resources.load(GameConstants.SERVICES_IMAGES);

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

        var delay = rand(200, 600);//privyazivatsy k tikam
        var timerId = setInterval(generateClientToCompany, delay);

        function generateClientToCompany()
        {
            gameModel.appendClient(generateClient());
            console.log("generated Client");
        }

        nextStep();
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
    function createMasters(count, servicesList){
        var newObj,
            services,
            list = [],
            autoincrement = counter(),
            startX = 250,
            startY = 200,
            offset = 100;
        for (var i = 0; i < count; i++)
        {
            autoincrement.increment();
            services = getRandomEntityIdsSubArray(servicesList, Math.max(Math.floor(Math.random()*3),1));
            console.log(services);
            newObj = new Master(autoincrement.value(),null, services, app.models.MasterLevels.getRandomLevel());
            newObj.name = randomGenerator.getRandomPeopleName();
            newObj.posX = i==0?startX:startX + offset * i;
            newObj.posY = startY;
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
    function createObjectsByCount(modelObject, count){
        var newObj,
            list = [],
            autoincrement = counter();
        for (var i = 0; i < count; i++)
        {
            autoincrement.increment();
            newObj = new modelObject(autoincrement.value());
            newObj.name = newObj.getStringName();
            list.push(newObj);
        }
        return list;
    }

    function updateGame(dt){
        //todo update client status and set to free master or add client to stack
        var newClients = gameModel.getNewClients();
        var mastersList = gameModel.getMasters();
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
                    console.log(clientModel.service, serviceModel);
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
                //console.log("has no free masters");
                    clientModel.isWait = true;
            }
        }
        //else
        //{
        for (i = 0; i< mastersList.length; i++)
        {
            if (!mastersList[i].isAvailable)
            {
                mastersList[i].loopService+=dt;
                // console.log(masters[i].loopService +">="+ masters[i].duration);
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
        //}

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

    /**
     * Game Step
     */
    function nextStep() {
        var now = Date.now();
        var dt = (now - lastLoopTime) / 1000.0;
        updateGame(dt);
        renderGame();

        lastLoopTime = now;
        requestAnimationFrame(nextStep);
    }

}

app.controllers.GameController = new GameController();
/**
 * Created by alexa on 21.08.2016.
 */
var Game = (function () {
    var services = [];// array services
    var clients = [];// array clients
    var masters = [];//array masters
    var balance = 0;
    function changeBalance(value){
        balance += value;
    }
    return {
        getServices: function(){
            return services;
        },
        setServices: function(value){
            services = value;
        },
        getRandomService : function(){
            return services[rand(0, services.length - 1)];
        },
        getServiceById : function(id){
            var service= null;
            for (var i = 0; i < services.length; i++)
            {
                if (services[i].id == id)
                {
                    service = services[i];
                    break;
                }

            }

            return service;

        },
        appendServices: function(value){
            services.push(value);
        },
        getClients: function(){
            return clients;
        },
        setClients: function(value){
            clients = value;
        },
        appendClient: function(value){
            clients.push(value);
        },
        getMasters: function(){
            return masters;
        },
        setMasters: function(value){
            masters = value;
        },
        appendMaster: function(value){
            masters.push(value);
        },
        getBalance: function (){
            return balance;
        },
        getNewClients: function(){
            var list = [];
            for (var i=0; i < clients.length; i++)
            {
                if (clients[i].isActive && !clients[i].inProgress /*&& !clients[i].isWait*/)
                    list.push(clients[i]);
            }
            return list;
        },
        getAvailableMastersByService: function(serviceID){
            var list = [];
            for (var i=0; i < masters.length; i++)
            {
                if (masters[i].getIsAvailable() && masters[i].services.indexOf(serviceID) >= 0)
                    list.push(masters[i]);
            }
            list = list.sort(function(a, b) {
                return parseFloat(a.level) - parseFloat(b.level);
            });
            return list;
        },
        getInProgressClients: function(){
            var list = [];
            for (var i=0; i < clients.length; i++)
            {
                if (clients[i].isActive && clients[i].inProgress)
                    list.push(clients[i]);
            }
            return list;
        },
        getWaitClients: function () {
            var list = [];
            for (var i=0; i < clients.length; i++)
            {
                if (clients[i].isActive && clients[i].isWait)
                    list.push(clients[i]);
            }
            return list;
        },
        updateBalance: function(value){
            changeBalance(value);
            console.log("****UPDATE BALANCE to value="+balance);
        }
    };
})();

app.models.Game = Game;
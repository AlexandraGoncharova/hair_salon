/**
 * Created by user on 17.08.2016.
 */

function Client(id, name, service, complexity){
    Entity.call(this, id, name);
    this.service = service;//serviceID
    this.complexity = complexity;
    this.inProgress = false;
    this.isActive = true;
    this.isWait = false;
    this.masterId = null;
    this.priceToPay = 0;
}

app.utils.extend(Client, Entity);

Client.prototype.getStringName = function (){
    return "Client";
};
app.models.Client = Client;


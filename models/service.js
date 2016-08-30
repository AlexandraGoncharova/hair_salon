/**
 * Created by user on 15.08.2016.
 */
function Service(id, name, price_coef, duration){
    Entity.call(this, id, name);
    this.getPrice = function(){
        return price_coef;
    };
    this.duration = duration;//duration for master 1 level complexity = 1

}
app.utils.extend(Service,Entity);

Service.prototype.getStringName = function (){
    return "Service";
};
app.models.Service = Service;

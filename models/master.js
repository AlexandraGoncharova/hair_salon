/**
 * Created by user on 17.08.2016.
 */
function Master(id, name, servicesList, level, salary){
    Entity.call(this, id, name);
    this.isAvailable = true;
    this.services = servicesList;
    this.level = level;
    this.currentService = null;
    this.loopService = 0;
    this.duration = 0;
    this.getSalary = function() {
        return salary;
    }
}
app.utils.extend(Master, Entity);
Master.prototype.getStringName = function (){
    return "Master";
};
Master.prototype.getIsAvailable = function(){
    return this.isAvailable;
};
Master.prototype.setIsAvailable = function(value){
    this.isAvailable = value;
};
Master.prototype.getService = function (id) {
    var serviceIndex = this.services.indexOf(id);
    if (serviceIndex >= 0)
        return this.services[serviceIndex];
    return null;
};
Master.prototype.canProvideService = function(id){
    return this.services.indexOf(id) >= 0;
};
app.models.Master = Master;
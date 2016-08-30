function Entity(id, name) {
    this.id = id;
    this.posX = 0;
    this.posY = 0;
    this.name = name;
}
Entity.prototype.getFullName = function() {
    return this.name+this.id;
};
Entity.prototype.setPosition = function (x,y){
    this.posX = x;
    this.posY = y;
};
Entity.prototype.update = function() {
    console.log("super main class.Update entity");
};
Entity.prototype.getStringName = function(){
    return "Entity";
};
app.models.Entity = new Entity();



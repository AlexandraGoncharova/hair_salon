/**
 * Created by alexa on 27.08.2016.
 */
function MasterLevels(){
    const BASE = 1;
    const HIGH = 2;
    const TOP = 3;
}

MasterLevels.prototype.getRandomLevel = function(){
    return rand(1,3);
};

app.models.MasterLevels = new MasterLevels();
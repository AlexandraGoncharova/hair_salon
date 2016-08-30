/**
 * Created by alexa on 21.08.2016.
 */
var GameConstants = Object.freeze({
    START_GAME_SERVICES: 5,
    START_GAME_MASTERS: 5,
    START_GAME_BALANCE: 1000,
    GAME_WIDTH:1000,
    GAME_HEIGHT:600,
    BACK_IMG_URL:'assets/back.jpg',
    SERVICES_LIST: ["Women's haircuts", "Men's haircuts", "Children's haircuts", "Haircut hot scissors",
        "Hair Styling", "Hair coloring", "Hair Highlights", "Men hair coloring", "Hair Biowave",
        "Perm and long hair styling "," Haircare","Wedding hairstyles","Hairstyles ","Laminating","Keratin hair straightening",
        "Cosmetology Services "," Wax depilation and shugaring","Correction and coloring eyebrows and eyelashes ",
        " Wedding Makeup "," Evening make-up "," Manicure ","Pedicure "," Gel polish","Barber"],
    SERVICES_IMAGES: [
        'assets/children\'s haircuts.png',
        'assets/default.png',
        'assets/haircut hot scissors.png',
        'assets/women\'s haircuts1.png',
        'assets/empty.png',
        'assets/back.jpg'],
    NAMES_LIST: ["Julieta", "Arlean", "Caitlin", "Jacqulyn", "Alycia", "Hoa", "Tess", "Latonya", "Hortense", "Madelene",
        "Justa", "Santina", "Nicki", "Sueann", "Karima", "Trista", "Pilar", "Sally", "Ema", "Freddy", "Mitch", "Erick", "Maryellen", "Sona", "Sabra", "Meridith", "Robyn", "Kenny", "Lelia", "Zulma", "Trish", "Irina", "Adelaide", "Jonathan", "Roxann", "Jinny", "Adele", "Caitlyn", "Clorinda", "Antwan",
        "Kimberlie", "Pamula", "Velva", "Georgia", "Sharda", "Milly", "Annalisa", "Sanford", "Dominque", "Allene"]
});
function RandomGenerator(){

}
RandomGenerator.prototype.getRandomPeopleName = function()
{
    return GameConstants.NAMES_LIST[rand(0, GameConstants.NAMES_LIST.length - 1)].trim();
};

RandomGenerator.prototype.getRandomServiceName = function()
{
    return GameConstants.SERVICES_LIST[GameConstants(0, GameConstants.SERVICES_LIST.length - 1)].trim();
};
RandomGenerator.prototype.getRandomUniqueService = function()
{
    var list = GameConstants.SERVICES_LIST.concat();
    var index, name;
    return function(){
        index = rand(0, list.length - 1);
        name = list[index];
        list.splice(index,1);
        return name.trim();
    };
};

const MAX_CLIENTS = 20;
const MAX_MASTERS = 10;




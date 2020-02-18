class Map {
    constructor(locations, characters, NPCs){
        this.locations = locations
        this.characters = characters
        this.NPCs = NPCs
    }

    initiateLocation(location) {
        game.eraseText()
        if (location.name == "MainHall") {
            game.displayText(`You are in the Main Hall.`)
        } else {
            game.displayText(`You are in ${location.name}.`)
        }
            game.displayText(`${location.description}`)
            let presentNPCs = game.charArray.slice(1).filter(NPC => NPC.location == location)
            presentNPCs.forEach(NPC => game.displayText(`${NPC.name} is here.`))
    }

    moveForward(character) { //game.map.moveForward(game.map.characters[0])
        if (character.inCombat == true) {
            return game.displayText("You cannot move to a different location when you are in combat!")
        }
        switch(true){
            case (character.location.name == "Cobol"):
                character.location = this.locations.MainHall
                this.initiateLocation(this.locations.MainHall)
                break;
            case (character.location.name == "MainHall"):
                character.location = this.locations.Pascal
                this.initiateLocation(this.locations.Pascal)
                break;
            case (character.location.name == "Pascal"):
                game.displayText("You cannot go forward, only back.")
                break;
        }

    }

    moveBack(character) {
        if (character.inCombat == true) {
            return game.displayText("You cannot move to a different location when you are in combat!")
        }   
        switch(true){
            case (character.location.name == "Pascal"):
                character.location = this.locations.MainHall
                this.initiateLocation(this.locations.MainHall)
                break;
            case (character.location.name == "MainHall"):
                character.location = this.locations.Cobol
                this.initiateLocation(this.locations.Cobol)
                break;
            case (character.location.name == "Cobol"):
                game.displayText("You cannot go back, only forward.")
                break;
        }
    }
}

class Location {
    constructor(name, description) {
        this.name = name
        this.description = description
    }

    describe(target){
        console.log(target.description)
    }
}

class Character {
    constructor(name, health, strength, inCombat, status, location, description) {
        this.name = name;
        this.health = health;
        this.strength = strength;
        this.inCombat = inCombat;
        this.status = status
        this.location = location;
        this.description = description;
        
    }
    
    attack(target) { //game.main.attack(game.NPCArray[3])
        if (target.location != game.main.location){
            game.displayText(`${target.name} is not here.`)
            return
        }

        this.inCombat = true
        if (this.lastAttacked) {
            this.lastAttacked = target
        }

        if (target.attitude == "friendly") {
            target.attitude = "hostile"
            game.displayText(`${target.name} becomes hostile!`)
        }
        if (this.health > 0) {
            const damage = this.strength;
            game.displayText(`${this.name} attacks ${target.name} and causes ${damage} damage points`)
            target.health -= damage;
        }
        if (target.health > 0) {
            game.displayText(`${target.name} has ${target.health} health points left`);
            if (target.attitude) target.attack(this)
        } else {
            target.health = 0;
            target.status = "dead";
            this.inCombat = false;
            target.inCombat = false;
            game.displayText(`${target.name} is dead!`)
            if (this.xp >= 0) {
                let bonusXP = 10;
                game.displayText(`${this.name} has eliminated ${target.name} and wins ${bonusXP} epxerience points.`)
                this.xp += bonusXP;
            } else {
                game.displayText("You have died! Booooooh, you failed")
            }
            if (target.name == "Cotton Turd" && target.status == "dead"){
                game.displayText("You have defeated the cotton turd! The camels rejoice - YOU HAVE WON!")
            }
        }
    }
}

class Main extends Character {
    constructor(name, health, strength, inCombat, status, location, description, lastAttacked, xp) {
        super(name, health, strength, inCombat, status, location, description)
        this.lastAttacked = lastAttacked;
        this.xp = xp;
    }

    describe(target){
        if (this.location == target.location){
            game.displayText(target.description)
        } else {
            game.displayText(`${target.name} is not here.`)
        }
    }
}

class NPC extends Character {
    constructor(name, health, strength, inCombat, status, location, description, attitude) {
        super(name, health, strength, inCombat, status, location, description)
        this.attitude = attitude;
    }
}

class Game {
    constructor(){
        this.charArray = []
        this.NPCs = {}
        this.locations = {}
        this.main = null
        this.map = null

        this.startBtn = document.querySelector(".start")
        this.textbox = document.querySelector(".textbox")
        this.forwardBtn = document.querySelector(".forward")
        this.backBtn = document.querySelector(".back")
        this.describeBtn = document.querySelector(".describe")
        this.attackBtn = document.querySelector(".attack")
        this.helpBtn = document.querySelector(".help")

        this.gameRunning = false
    }

    setup() {

        this.startBtn.addEventListener("click", function(_){
            (game.gameRunning == true) ? location.reload() : game.init() //ERROR
        })
        this.helpBtn.addEventListener("click", function(_){
            alert('These are the game commands...')
        })
    }

    init() {
        if (game.charArray) game.charArray = [] 

        this.createLocation("Cobol", "Feels like home. A doorway leads forward to the Main Hall.")
        this.createLocation("MainHall", "There are insufficient sofas in the lounge. A door leads back to Cobol, another to Pascal. A foul smell comes from Pascal.")
        this.createLocation("Pascal", "The classroom feels alien. A doorway leads back to the Main Hall.")
        
        this.main = this.createMain("Linus the Avenger", 100, 25, false, "alive", this.locations.Cobol, "This is you - the awesome hero who is going to bring justice to the camels.", 1, 0)
        this.createNPC("Crying Camel", 30, 10, false, "alive", this.locations.Cobol, "Crying Camel is sobbing uncontrollably. 'Please', he says, 'save my friends from the cotton monster!'", "friendly")
        this.createNPC("Weeping Camel", 30, 10, false, "alive", this.locations.MainHall, "The camel is weeping. 'The monster is just behind that doorway - will you please help us?'", "friendly")
        this.createNPC("Enslaved Camel", 30, 10, false, "alive", this.locations.Pascal, "A camel enslaved by the cotton turd.", "friendly")
        this.createNPC("Cotton Turd", 75, 25, false, "alive", this.locations.Pascal, "Behold the lord of all enslaved camels!", "hostile")
        this.createMap(this.locations, this.charArray, this.NPCs)
        
        this.map.initiateLocation(this.locations.Cobol)

        if (game.gameRunning) return

        this.forwardBtn.addEventListener("click", function(_){
            game.map.moveForward(game.map.characters[0])
        })
        this.backBtn.addEventListener("click", function(_){
            game.map.moveBack(game.map.characters[0])
        })
        this.describeBtn.addEventListener("click", function(_){
            let input = prompt("Which character would you like to describe?")
            if (game.NPCs.hasOwnProperty(input)) { //hur ignorera case och antalet mellanslag?
                let target = game.NPCs[input]
                game.main.describe(target)  
            } else if (input == null || input == "") { return }
            else {
                game.displayText(`There is no character with the name "${input}".`)
            }
        })
        this.attackBtn.addEventListener("click", function(_){
            if (game.main.inCombat == true){
                // for (inCombat of game.NPCs){

                // }
                // // let target = game.NPCs.hasOwnProperty(inCombat = true)
                return game.main.attack(game.main.lastAttacked)
            }
            let input = prompt("Which character will you attack?")
            if (game.NPCs.hasOwnProperty(input)) { //hur ignorera case och antalet mellanslag?
                if (game.NPCs[input].status == "dead"){
                    return game.displayText(`${input} is dead.`)
                }
                let target = game.NPCs[input]
                game.main.attack(target)
            } else if (input == null || input == "") { return } 
            else {
                game.displayText(`There is no character with the name "${input}".`)
            }
        })
        game.gameRunning = true
    }
    
    createLocation(name, description) {
        let newLoc = new Location(name, description)
        this.locations[name]=newLoc 
        
    }
    
    createMain(name, health, strength, inCombat, status, location, description, lastAttacked, xp) {
        // let location = this.locations.Cobol
        // let charLocation = location[0] //kolla upp metod "array.find"    
        let newChar = new Main(name, health, strength, inCombat, status, location, description, lastAttacked, xp)
        this.charArray.push(newChar)
        return newChar
    }
    
    createNPC(name, health, strength, inCombat, status, location, description, attitude) {
        let newChar = new NPC(name, health, strength, inCombat, status, location, description, attitude)
        this.NPCs[name] = newChar
        this.charArray.push(newChar)
        return newChar
    }

    createMap(locations, characters, NPCs){
        let map = new Map(locations, characters, NPCs)
        this.map = map
    }

    displayText(txt) {
        document.querySelector(".gameLog").innerHTML += `${txt}<br>`;
      };

    eraseText() {
        document.querySelector(".gameLog").innerHTML = "";
    }
}



let game = new Game
game.setup()


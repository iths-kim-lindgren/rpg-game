//skapa init-funktion i map som skapar första location
//render-funktion i map som uppdaterar alla objekts läge
//on mouseDown, kolla om musens position är innanför alla locations x- och y-koordinater
//alltså loopa över alla objekts x- och y-koordinater
//om musen är innanför en locations koordinater, starta en renderfunktion som 
//uppdaterar koordinaterna beroende på musens rörelser
//rendera även paths från location på nytt
//on mouseUp, avsluta render-funktionen
//lagra alla x- och y-koordinater för locations, skapa funktion för att kolla om musen är på en location


let canvas = document.querySelector("#myCanvas")
let ctx = canvas.getContext("2d")
let canvasWidth = 480
let canvasHeight = 320

class Map {
    constructor(locations, pieces, paths) {
        this.locations = {}
        this.pieces = {}
        this.paths = {}
        this.mouseDrag = false
    }

    init(name, x, y, paths, adjLocations) {
        canvas.addEventListener("mousedown", (e) => {
            this.mouseDown(e)
        })

        let firstLocation = new Location("home", 10, 10, null, null)
        firstLocation.create("home", 10, 10, null, null)
    }

    mouseDown(e) {
        canvas.removeEventListener("mousedown", (e) => {
            this.mouseDown(e)
        })
            Object.entries(map.locations).forEach(function(entry){
                let x = entry[1].x
                let y = entry[1].y
               //Object.entries skapar en array av objektet
                if (e.pageX < x + 75 + canvas.offsetLeft && e.pageX > x - 75 +
                    canvas.offsetLeft && e.pageY < y + 20 + canvas.offsetTop &&
                    e.pageY > y - 20 + canvas.offsetTop) {
                    map.mouseDrag = true

                    let objectName = entry[1].name
                    canvas.addEventListener("mousemove", (e) => {
                        console.log(`mouseDown ${x}${y}`)
                        map.mouseMove(e, map.locations[objectName])
                    });
                }
            })
            canvas.addEventListener("mouseup", (e) => {
                map.mouseUp(e)
            })
        }

    mouseMove(e, location){
        if (map.mouseDrag){
            location.x = e.pageX - canvas.offsetLeft;
            location.y = e.pageY - canvas.offsetTop;
            console.log(`mousemove ${location.x}${location.y}`)


            map.render(ctx)
            //måste skicka in koordinater till render för att EN av lådorna ska byta plats
            //när musen rör sig, rita om lådan till dess nya koordinater
            //rendera allt på sidan
        }
    }
    
    mouseUp(e) {
        this.mouseDrag = false
        canvas.removeEventListener("mousemove", (e) => {
            map.mouseMove(e, map.locations[objectName])
        })
    }
    
    render(ctx) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        Object.entries(map.locations).forEach(function(location){
            let x = location[1].x
            let y = location[1].y
            console.log(`Render ${x}${y}`)
            // if (x == movingLocationX) && (y == movingLocationY)
            let name = location[1].name
        map.locations[name].draw(ctx, x, y)

        })
        //gör en for-loop över alla locations och rita upp dem med deras draw-metoder
    }


}

class Location {
    constructor(name, x, y, paths, adjLocations) {
        this.name = name
        this.x = x
        this.y = y
        this.paths = paths
        this.adjLocations = adjLocations
        this.width = 75
        this.height = 20
        this.color = "black"
    }

    create(locationName, x, y, paths, adjLocations) {
        let location = new Location(locationName, x, y, paths, adjLocations)
        map.locations[locationName] = location
        //för varje objekt som ritas ut, lagra objektet i map
        this.draw(ctx, x, y)

        location.addEventListener //klicka på den för att öppna meny och skapa en ny location
    }

    draw(ctx, x, y) {
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }
}

class Path {
    constructor(terrain, adjLocations) {
        this.terrain = terrain
        this.adjLocations = adjLocations
    }
}

class Piece {
    constructor(name, location) {
        this.name = name;
        this.location = location;
    }
}

let map = new Map(null, null, null)
map.init("home", 10, 10, null, null)
map.locations["home"].create("away", 180, 180, null, null)
// map.locations["home"].create("away", 180, 100, null, null)
// map.locations["home"].create("away", 100, 180, null, null)
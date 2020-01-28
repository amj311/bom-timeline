window.mobileAndTabletCheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};



var app = new Vue ({
    el: '#app',

    data: {
        isAdmin: false,
        adminKey: 'immerseBOM',
        items: [],
        arcs: [],
        minEraWidth: 80,
        dateMin: null,
        dateMax: null,
        startYear: null,
        numEras: 9,
        eraDuration: null,
        yearUnit: 20,
        minYearUnit: null,
        zoomTimeout: false,
        coverImg: true,
        theaterMode: "img",
        theaterOn: false,
        subsOn: true,
        theaterData: {},
        records: [],
        MONTH: ["No Month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"],
        isMobile: false,
        dividerHeight: 8,
        handFont: true,
        showModal: false,
        notes: [],
        modalData: {},


        tempItem: {},

        addingType: "",
        addingItem: false,
        newEventDefault: {
            "type":"event",
            "name": "New Artwork",
            "artist": null,
            "day": null,
            "month": null,
            "year": null,
            "displayYear": false,
            "pos": 50,
            "img": null,
            "period": null,
            "id": 2,
            "group":"int",
            "recId":null,
            isNewPlaceholder: true,
        },
        editingItem: false,
        tempItemIdx: null,
        editOriginal: {},
        
        addingArc: false,
        newArcDefault: {
            "name": "New Artwork",
            "color": "#bbb",
            isNewPlaceholder: true,
        },
        editingArc: false,
        editArcIdx: null,
        editArcOriginal: {},
        sources: [],
    },

    async created() {
        this.checkAdmin()

        this.getEvents()
        this.getArcs()
        this.getNotes()
        this.getRecords()
        this.getSources()

        this.isMobile = window.mobileAndTabletCheck();
    },

    watch: {
        items: function() {
            this.setZoom()
        },
        yearUnit: function() {
            this.checkEraDuration()
        }
    },

    methods: {
        checkAdmin() {
            if (localStorage.getItem('adminKey') === this.adminKey) {
                this.isAdmin = true;
            }
        },
        loginAdmin(){
            if (prompt('What is the password?') === this.adminKey) {
                localStorage.setItem('adminKey', this.adminKey)
                this.isAdmin = true;
            }
            else alert('Sorry, wrong password.')
        },
        logoutAdmin() {
            if(confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('adminKey')
                this.isAdmin = false;
            }
        },


        async getEvents() {
            try {
                let response = await axios.get("/api/items");
                this.items = response.data;
                console.log(response.data)
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },

        async getArcs() {
            try {
                let response = await axios.get("/api/arcs");
                this.arcs = response.data;
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },

        getNotes(){
            this.notes = notesData;
        },

        getRecords(){
            this.records = recordsData;
        },
        getSources(){
            this.sources = sourcesData;
        },


        async deleteItem(item) {
            if (confirm(`Are you sure you want to delete ${item.type} '${item.name}?'`))
            {
                try {
                    // console.log("Made it into deleteItem");
                    let url;
                    if (item.type === 'event') url = "/api/items/";
                    if (item.type === 'arc') url = "/api/arcs/";
                    let response = axios.delete(url + item._id);
                    
                    if (item.type === 'event') this.getEvents();
                    if (item.type === 'arc') this.getArcs();
                    this.closeEditForm();
                    return true;
                }
                catch (error) {
                    console.log(error);
                }
            }
        },

        openAddForm(type) {
            if (!this.editingItem && !this.addingItem) {

                // default new event
                if (type === "event") {
                    this.tempItem = {
                        "type": "event",
                        eventType: 'normal',
                        "name": "New Event",
                        "artist": null,
                        "day": null,
                        "month": null,
                        "year": Math.floor((document.querySelector('#timeline-box').scrollLeft + 50) / this.yearUnit + this.startYear),
                        "displayYear": false,
                        "pos": 50,
                        "img": null,
                        "period": null,
                        "id": 2,
                        "group": "int",
                        "recId": null,
                        "note": "",
                        "arcId": null,
                        isNewPlaceholder: true,
                    };
                    this.items.push(this.tempItem)
                }

                // default new arc
                if (type === "arc") {
                    this.tempItem = {
                        "type": "arc",
                        "name": "New Arc",
                        "color": "#bbb",
                        "note": "",
                        isNewPlaceholder: true,
                    };
                    this.items.push(this.tempItem)
                }


            this.addingItem = true;
        }
    },

        handleChangeAddYear(){
            this.setZoom()
            // this.scrollToEl(document.querySelector('.eventPos.hardFocus')) 
        },


        handleSubmitForm(){
            if (this.addingItem) this.addItem(this.tempItem)
            if (this.editingItem) this.submitEdit(this.tempItem)
        },

        handleCancelForm(){
            if (this.addingItem) this.cancelAddForm()
            if (this.editingItem) this.cancelEditForm()
        },

        async addItem(item) {
            console.log(item, this.tempItem)
            let urlBase;
            if (item.type === 'event') urlBase = '/api/items';
            if (item.type === 'arc') urlBase = '/api/arcs';
            try {
                let res = await axios.post(urlBase, item)
                console.log(res)
                if (item.type === 'event') this.getEvents()
                if (item.type === 'arc') this.getArcs()
                this.closeAddForm();
            }
            catch (error) {
                console.log(error)
            }
        },

        cancelAddForm() {
            this.items = this.items.filter(p => !p.isNewPlaceholder)
            this.arcs = this.arcs.filter(a => !a.isNewPlaceholder)

            this.closeAddForm();
        },
        
        closeAddForm() {
            if (this.addingItem) {
                this.addingItem = false;
            }
        },

        openEditForm(item) {
            if (!this.editingItem && !this.addingItem) {
                this.tempItem = item;

                this.tempItemIdx = this.items.lastIndexOf(item) 
                Object.assign(this.editOriginal, item)

                item.hasFocus = true;

                this.editingItem = true;
            }
        },

        async submitEdit(item) {
            let url;
            if (item.type === 'event') url = "/api/items/";
            if (item.type === 'arc') url = "/api/arcs/";

            try {
                let res = await axios.put(url + item._id, item)
                console.log(res.data)

                if (item.type === 'event') this.getEvents();
                if (item.type === 'arc') this.getArcs();

                this.closeEditForm();
            }
            catch (error) {
                console.log(error)
            }
        },

        cancelEditForm() {
            if (this.editingItem) {
                Object.assign(this.tempItem, this.editOriginal)
                this.closeEditForm()
            }
        },

        closeEditForm() {
            if (this.editingItem) {
                this.tempItem.hasFocus = false;
                this.tempItem = false;

                this.editingItem = false;
            }
        },

        getOptionsFor(list, prop) {
            let options = [];
            list.forEach(item => {
                if (options.lastIndexOf(item[prop]) < 0) options.push(item[prop])
            })
            return options;
        },

        getArcById(id) {
            return this.arcs.filter(a => a._id === id)[0]
        },

        setTheaterImage(shortId) {
            this.theaterMode = 'img'
            let obj = this.findInListById(this.timelineEls.events, shortId)
            this.theaterData = obj;

            this.theaterData.hasSubs = true;

            this.openTheater();
        },

        setTheaterRecord(shortId) {
            this.theaterMode = 'rec';
            this.theaterData = {}
            this.theaterData.hasSubs = false;
            
            this.openTheater();

            if (shortId) {
                let record = document.getElementById(`rec_${shortId}`)
                console.log(record)

                setTimeout( function(){ app.scrollToEl(record) }, 10)
            }

        },
        scrollToEl(el){
            el.classList.add('focus')
            el.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
            setTimeout( function(){ el.classList.remove('focus') }, 2000)
        },

        openTheater() {
            this.closeNote()
            this.theaterOn = true;
            this.subsOn = false;
        },

        closeTheater() {
            this.theaterOn = false;
        },
        
        toggleSubs() {
            this.subsOn = !this.subsOn;
        },

        
        setZoom() {
            let viewWidth = document.getElementById('timeline-box').offsetWidth;

            let years = this.timelineEls.events.map(e => e.year)
            this.dateMax = Math.max.apply(null, years)
            this.dateMin = Math.min.apply(null, years)
            let range = this.dateMax - this.dateMin;

            this.minYearUnit = ((viewWidth - 50) / (range))
            this.yearUnit = this.minYearUnit;

            this.checkEraDuration()

            this.startYear = Math.floor(this.dateMin / this.eraDuration) * this.eraDuration - this.eraDuration;
        },


        handleTimelineScroll(e) {
            var y = -e.deltaY;
            let ival = 50;

            if (y != 0 && !this.zoomTimeout) {
                if (Math.abs(y) > 1) {
                    let oldUnit = this.yearUnit;

                    let delta = y / 500;
                    this.changeYearUnit(delta)

                    // modify scroll position relative to mouse
                    let scrollBox = document.querySelector('#timeline-box');
                    let vp = scrollBox.getBoundingClientRect();
                    let mouseX = e.clientX - vp.x;

                    let newMPos = (scrollBox.scrollLeft + mouseX) * this.yearUnit / oldUnit;
                    scrollBox.scrollLeft = newMPos - mouseX;

                    this.zoomTimeout = true;
                    setTimeout(function() { app.zoomTimeout = false }, ival)
                }
            }
        },

        handleButtonZoomIn(){
            this.handleButtonZoom(0.4)
        },
        resetZoom(){
            this.yearUnit = this.minYearUnit;
        },
        handleButtonZoomOut(){
            this.handleButtonZoom(-0.4)
        },
        handleButtonZoom(delta){
            let oldUnit = this.yearUnit;
            this.changeYearUnit(delta)

            // modify scroll position to maintain center
            let scrollBox = document.querySelector('#timeline-box');
            let vp = scrollBox.getBoundingClientRect();
            let newMPos = (scrollBox.scrollLeft + vp.width/2) * this.yearUnit / oldUnit;
            scrollBox.scrollLeft = newMPos - vp.width/2;
        },

        changeYearUnit(delta) {
            this.yearUnit = Math.max(this.minYearUnit, this.yearUnit * (1 + delta));
            // console.log(this.minYearUnit, this.yearUnit);
        },

        checkEraDuration() {
            let range = this.dateMax - this.startYear;

            this.eraDuration = 1;

            while(this.yearUnit * this.eraDuration < this.minEraWidth){
                if (this.eraDuration%2 == 0 || this.eraDuration == 1) this.eraDuration *=5
                else this.eraDuration *= 2;
            }

            this.numEras = Math.ceil(range / this.eraDuration) + 2;

        },

        toggleHandwriting() {
            this.handFont = !this.handFont;
        },
        findInListById(list, id) {
            return list.filter( n => n.elId === id)[0]
        },
        openNote(shortId) {
            this.showModal = true;

            let elId = 'note_' + shortId;
            let el = document.getElementById(elId)
            if (el) {
                // console.log('scrolling to '+elId, el)
                setTimeout( function(){ app.scrollToEl(el) }, 10)
            }
            else console.log('could not find id '+elId)
        },
        closeNote(){
            this.showModal = false;
        }
    },

    computed: {
        eras() {
            let array = [];
            for (i = 0; i < this.numEras; i++)
            {
                array.push(this.startYear + i*this.eraDuration)
            }
            return array;
        },
        eraWidth() {
            return this.yearUnit*this.eraDuration;
        },

        timelineEls() {
            this.arcs.forEach(a => a.points = [])

            let events = []

            this.items.filter( i => i.type === 'event' ).forEach ( event => {
                // if (event.eventType != 'anchor') event.eventType = "normal";
                // this.tempItem.type = "event";
                // this.addItem(event)

                let yearPos = (event.year - this.startYear) * this.yearUnit;
                let monthPos = event.month * this.yearUnit / 12;
                let dayPos = event.day * this.yearUnit / (12 * 31) 
                event.relX = yearPos + monthPos + dayPos;
                
                event.relY = (event.pos/100) * document.getElementById('timeline-box').offsetHeight;

                event.idString = `event_${events.length}`
                event.yearStr = event.year < 0 ?
                    -event.year+' BC' : event.year+' AD';
                
                event.dateStr = "";
                if (event.month) {
                    event.dateStr += this.MONTH[event.month];
                    if (event.day && event.day != 0) event.dateStr += ' '+event.day
                    event.dateStr += ', ';
                }
                event.dateStr += event.yearStr;

                if (this.getArcById(event.arcId)) {
                    event.arc = this.getArcById(event.arcId)
                    event.arc.points.push({"relY": event.relY, "relX": event.relX})
                }

                events.push(event)
            })

            this.arcs.forEach(arc => {
                arc.type = 'arc';
                arc.points.sort((a, b) => a.relX - b.relX);
                arc.left = arc.points.reduce( (min,p) => Math.min(p.relX, min), Infinity ) - 5;
                arc.base = arc.points.reduce( (min,p) => Math.min(p.relY, min), Infinity ) - 5;
                arc.right = arc.points.reduce( (max,p) => Math.max(p.relX, max), 0 ) + 5;
                arc.top = arc.points.reduce( (max,p) => Math.max(p.relY, max), 0 ) + 5;
            })
            
            return {events, "arcs": this.arcs};
        },

        // noteEls(){
        //     let array = this.items.filter( i => i.type === 'note' )
        // },
        // recordEls(){
        //     return this.items.filter( i => i.type === 'record' )
        // },

    }
})


document.addEventListener('keyup', e => {
    if (e.keyCode === 27 && app.showModal) { return app.closeNote() }
    else if (e.keyCode === 27 && app.theaterOn) { return app.closeTheater() }
})

document.addEventListener('scroll', app.doScroll)
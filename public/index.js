window.mobileAndTabletCheck = function() {
    var check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};


var app = new Vue({
    el: '#app',

    data: {
        timeBoxEl: document.querySelector('#timeline-box'),

        apiUrl: "https://amj311-bom-timeline.herokuapp.com/api",

        isLoading: true,
        isAdmin: false,
        adminKey: 'immerseBOM',
        menuIsOpen: false,

        mouseTimePos: {
            x: null,
            y: null,
        },
        arcCardYPos: 0,

        items: [],
        arcs: [],
        minEraWidth: 80,
        dateMin: null,
        dateMax: null,
        startYear: null,
        numEras: 9,
        eraDuration: null,
        yearUnit: 20,
        dayUnit: this.yearUnit / 365,
        minYearUnit: null,
        maxYearUnit: null,
        initYearUnit: 1,
        initCenterYear: 34,
        canZoom: true,
        zoomTargetPos: 0,
        minEventDistance: 8,
        maxZoomDeterminant: 15,
        minEventPosDiff: 2,

        coverImg: true,
        theaterMode: "img",
        theaterOn: false,
        subsOn: true,
        theaterData: {},
        records: [],
        MONTH: ["No Month", "Nisan", "Iyar", "Sivan", "Tammuz", "Ab", "Elul", "Tishri", "Heshvan", "Kisiev", "Tebeth", "Shebat", "Adar"],
        isMobile: false,
        dividerHeight: 0,
        handFont: true,
        showModal: false,
        notes: [],
        modalData: {},

        tempItem: {},

        itemTypes: ['event', 'arc'],
        eventTypes: ['normal', 'secondary', 'image', 'anchor'],
        addingType: "",
        addingItem: false,
        newEventDefault: {
            "type": "event",
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
            "group": "int",
            "recId": null,
            isNewPlaceholder: true,
        },
        newListName: '',
        newProphecyName: '',
        currentOptionsFilter: [],
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



        // Qwizard
        showQuiz: false,
        activeQIdx: 0,
        displayQIdx: 0,
        toggleQReverse: false,
        show_Qback: false,

        books: [
            { name: "1 Nephi", startYear: -599, endYear: -589, step: 1 },
            { name: "2 Nephi", startYear: -589, endYear: -544, step: 1 },
            { name: "Jacob", startYear: -544, endYear: -515, step: 1 },
            { name: "Enos", startYear: -515, endYear: -420, step: 1 },
            { name: "Jarom", startYear: -420, endYear: -361, step: 1 },
            { name: "Omni", startYear: -361, endYear: -135, step: 1 },
            { name: "Words of Mormon", startYear: -135, endYear: -123, step: 1 },
            { name: "Mosiah", startYear: -123, endYear: -90, step: 1 },
            { name: "Mosiah 9-24", startYear: -176, endYear: -120, step: 2 },
            { name: "Alma", startYear: -90, endYear: -51, step: 1 },
            { name: "Helaman", startYear: -51, endYear: 0, step: 1 },
            { name: "3 Nephi", startYear: 0, endYear: 35, step: 1 },
            { name: "4 Nephi", startYear: 35, endYear: 321, step: 1 },
            { name: "Mormon", startYear: 321, endYear: 385, step: 1 },
            { name: "Moroni", startYear: 385, endYear: 421, step: 1 },
        ],
    },

    async created() {
        this.checkAdmin()

        await this.getEvents()
        await this.getArcs()

        this.isMobile = window.mobileAndTabletCheck();
        if (window.innerWidth > 500) this.menuIsOpen = true;

        this.setZoom(true);


        // Qwizard
        this.displayQIdx = this.activeQIdx + 1;


        setTimeout(function() {
            app.resetZoom();
            this.isLoading = false;
        }, 0);

    },

    watch: {
        // items: function() {
        //     this.setZoom()
        // },
        yearUnit: function() {
            this.checkEraDuration()
            this.dayUnit = this.yearUnit / 365;
        },
        items: function() {},

        // Qwizard
        activeQIdx: () => {
            app.show_Qback = app.quizCards[app.activeQIdx].reversed;
            app.displayQIdx = app.activeQIdx + 1;
        },
        displayQIdx: () => {
            app.activeQIdx = app.displayQIdx - 1;
        }
    },

    methods: {
        checkAdmin() {
            if (localStorage.getItem('adminKey') === this.adminKey) {
                this.isAdmin = true;
            }
        },
        loginAdmin() {
            if (prompt('What is the password?') === this.adminKey) {
                localStorage.setItem('adminKey', this.adminKey)
                this.isAdmin = true;
            }
            else alert('Sorry, wrong password.')
        },
        logoutAdmin() {
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('adminKey')
                this.isAdmin = false;
            }
        },


        toggleMenu() {
            this.menuIsOpen = !this.menuIsOpen;
        },

        openMenuToTab(tabTriggerId) {
            let tab = $('#myTab a#' + tabTriggerId)
            if (tab) {
                this.menuIsOpen = true;
                tab.tab('show')
                this.scrollToEl(tab[0]);
            }
        },

        openMenuToList(listType, listName) {
            this.openMenuToTab(listType + '-tab')
            $('#' + this.codifyString(listName)).collapse('show')
            setTimeout(() => this.scrollToEl($('#' + this.codifyString(listName))[0]), 200)
        },

        openMenuToEvent(eventIdString) {
            this.openMenuToTab('all-events-tab')
            setTimeout(() => this.scrollToEl($('#menu_' + eventIdString)[0]), 200)
        },

        openMenuToPlace(placeName) {
            this.openMenuToTab('places-tab')
            let $el = $('#' + this.codifyString(placeName))
            $el.collapse('show')
            setTimeout(() => this.scrollToEl($el[0]), 200)
        },

        async getEvents() {
            try {
                let response = await axios.get(this.apiUrl+"/items");
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
                let response = await axios.get(this.apiUrl+"/arcs");
                this.arcs = response.data;
                return true;
            }
            catch (error) {
                console.log(error);
            }
        },

        async deleteItem(item) {
            if (confirm(`Are you sure you want to delete ${item.type} '${item.name}?'`)) {
                try {

                    if (item.type === 'arc') {
                        this.items.forEach(i => {
                            if (i.arcId === item._id) {
                                i.arcId = null;
                            }
                        })
                    }

                    let url;
                    if (item.type === 'event') url = this.apiUrl+"/items/";
                    if (item.type === 'arc') url = this.apiUrl+"/arcs/";
                    await axios.delete(url + item._id);

                    this.getEvents();
                    this.getArcs();
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
                        idString: "tempItem",
                        "type": "event",
                        color: null,
                        customIcon: null,
                        eventType: 'normal',
                        "name": "New Event",
                        "artist": null,
                        "day": null,
                        "month": null,
                        "year": Math.floor((document.querySelector('#timeline-box').scrollLeft + document.querySelector('#timeline-box').offsetWidth / 4) / this.yearUnit + this.startYear),
                        "displayYear": false,
                        "pos": 50,
                        "img": null,
                        imgCred: null,
                        width: 100,
                        offset: -50,
                        "period": null,
                        "id": 2,
                        "note": "",
                        "arcId": null,
                        "lists": [],
                        "prophecies": [],
                        scriptureLink: null,
                        isNewPlaceholder: true,
                    };
                    this.items.push(this.tempItem)
                }

                // default new arc
                if (type === "arc") {
                    this.tempItem = {
                        idString: "tempItem",
                        "type": "arc",
                        "name": "New Arc",
                        "color": "#bbb",
                        "note": "",
                        isNewPlaceholder: true,
                    };
                    this.arcs.push(this.tempItem)
                }

                this.tempItem.hasFocus = true;
                this.addingItem = true;
            }
        },

        handleChangeAddYear() {
            if (this.tempItem.year > this.dateMax || this.tempItem.year < this.dateMin) this.setZoom()
            this.scrollToFocusedEl()
        },

        handleAddItemToList(listType, listName) {
            if (this.tempItem[listType].lastIndexOf(listName) < 0) this.tempItem[listType].push(listName)
            this.newListName = this.newProphecyName = '';
        },
        handleRemoveItemFromList(listType, listName) {
            this.tempItem[listType] = this.tempItem[listType].filter(list => list != listName)
        },
        handleRemoveALLFromList(listType, listName) {
            this.timelineEls.events.forEach(e => e[listType].filter(l => l != listName))
        },
        handleChangeListName(listType, listName, newName) {
            // if (this.getOptionsFor(this.timelineEls.events, listType).lastIndexOf(newName) >= 0) return alert('that list already exists!')
            this.timelineEls.events.forEach(e => e[listType].filter(l => l != listName))
        },

        codifyString(string) {
            console.log(string)
            if (string) return string.split('').filter(c => !/[^a-zA-Z0-9]/.test(c)).join('')
        },

        handleSubmitForm() {
            if (this.addingItem) this.addItem(this.tempItem)
            if (this.editingItem) this.submitEdit(this.tempItem)
        },

        handleCancelForm() {
            if (this.addingItem) this.cancelAddForm()
            if (this.editingItem) this.cancelEditForm()
        },

        async addItem(item) {
            let urlBase;
            if (item.type === 'event') urlBase = this.apiUrl+'/items';
            if (item.type === 'arc') urlBase = this.apiUrl+'/arcs';
            try {
                let res = await axios.post(urlBase, item)
                console.log(res)
                item.hasFocus = false;
                item._id = res.data._id;
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
            this.newListName = '';
        },

        openEditForm(item) {
            if (!this.editingItem && !this.addingItem) {
                this.tempItem = item;

                this.tempItemIdx = this.items.lastIndexOf(item)
                Object.assign(this.editOriginal, item)

                item.hasFocus = true;

                this.editingItem = true;
                setTimeout(() => this.scrollToEl(document.querySelector('.eventPos.hardFocus')), 5)
            }
        },

        async submitEdit(item) {
            let url;
            if (item.type === 'event') url = this.apiUrl+"/items/";
            if (item.type === 'arc') url = this.apiUrl+"/arcs/";

            try {
                let res = await axios.put(url + item._id, item)
                console.log(res.data)

                item.hasFocus = false;
                item._id = res.data._id;

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

                this.newListName = '';
                this.editingItem = false;
            }
        },

        getOptionsFor(list, prop) {
            let options = [];
            list.forEach(item => {

                if (options.lastIndexOf(item[prop]) < 0) options.push(item[prop])
            })
            options = options.flat(Infinity)
            options.sort()
            options = new Set(options)
            return options;
        },

        getArcById(id) {
            return this.arcs.filter(a => a._id === id)[0]
        },

        getPrevEvent(id) {
            for (let i = 0; i < this.timelineEls.events.length; i++) {
                if (this.timelineEls.events[i].id == id) return this.timelineEls.events[i - 1];
            }
            return false;
        },
        getNextEvent(id) {
            for (let i = 0; i < this.timelineEls.events.length; i++) {
                if (this.timelineEls.events[i].id == id) return this.timelineEls.events[i + 1];
            }
            return false;
        },

        setTheaterImageByTag(shortId) {
            this.theaterMode = 'img'
            let obj = this.findInListById(this.timelineEls.events, shortId)
            this.theaterData = obj;

            this.theaterData.hasSubs = true;

            this.openTheater();
        },


        setTheaterImageByObj(obj) {
            this.theaterMode = 'img'
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

                setTimeout(function() { app.scrollToEl(record) }, 10)
            }

        },

        highlightEventByIdString(idString, exclusive = false) {
            if (exclusive) document.querySelectorAll('.focus').forEach(el => el.classList.remove('focus'))

            let waitTime = 0;

            if (window.innerWidth < 495) {
                waitTime = 1000;
                this.toggleMenu()
            }

            setTimeout(() => {
                let el = document.getElementById(idString)
                if (el) app.scrollToEl(el)
            }, waitTime)
        },

        scrollToFocusedEl() {
            setTimeout(() => this.scrollToEl(document.querySelector('.eventPos.hardFocus')), 500)
        },

        scrollToEl(el) {
            el.classList.add('focus')
            el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
            setTimeout(function() { el.classList.remove('focus') }, 5000)
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

        setMaxZoom(smallestEventDaysDiff) {
            this.maxYearUnit = (this.maxZoomDeterminant / smallestEventDaysDiff) * 365;
        },

        setZoom(setInit) {
            let viewWidth = document.getElementById('timeline-box').offsetWidth;

            let years = this.timelineEls.events.map(e => e.year)
            this.dateMax = Math.max.apply(null, years)
            this.dateMin = Math.min.apply(null, years)
            let range = this.dateMax - this.dateMin;

            this.minYearUnit = ((viewWidth - 50) / (range))
            this.yearUnit = setInit ? this.initYearUnit : this.minYearUnit;

            this.checkEraDuration()

            this.startYear = Math.floor(this.dateMin / this.eraDuration) * this.eraDuration - this.eraDuration;
        },

        pauseZoom() {
            this.canZoom = false;
        },
        allowZoom() {
            this.canZoom = true;
        },

        handleTimelineScroll(e) {
            var y = -e.deltaY;
            let ival = 100;

            if (y != 0 && this.canZoom) {
                if (Math.abs(y) > 1) {
                    let oldUnit = this.yearUnit;

                    let scrollBox = document.querySelector('#timeline-box');
                    let vp = scrollBox.getBoundingClientRect();
                    let oldScrollPos = scrollBox.scrollLeft;
                    let mouseX = e.clientX - vp.x;
                    let mouseTimePos = scrollBox.scrollLeft + mouseX;


                    let delta = y / 500;
                    this.changeYearUnit(delta)

                    let newMPos = mouseTimePos * (this.yearUnit / oldUnit);
                    scrollBox.scrollLeft = newMPos - mouseX;

                    let newScrollPos = scrollBox.scrollLeft;
                    console.log(newScrollPos - oldScrollPos)


                    this.canZoom = false;
                    setTimeout(function() { app.canZoom = true }, ival)
                }
            }
        },

        handleButtonZoomIn() {
            this.handleButtonZoom(0.4)
        },
        resetZoom() {
            this.isLoading = true;
            this.yearUnit = this.initYearUnit;
            let scrollTarget = this.initCenterYear ?
                (this.initCenterYear - this.startYear) * this.yearUnit :
                document.getElementById('timeline-box').scrollWidth / 2;

            setTimeout(function() {
                document.getElementById('timeline-box').scrollLeft = scrollTarget - document.getElementById('timeline-box').offsetWidth / 2;
            }, 0)
            setTimeout(function() {
                app.handleButtonZoom(.001);
                this.isLoading = false;
            }, 2);

        },
        handleButtonZoomOut() {
            this.handleButtonZoom(-0.4)
        },
        handleButtonZoom(delta) {
            if (this.canZoom) {
                app.isLoading = true;
                this.pauseZoom()

                let scrollBox = document.querySelector('#timeline-box');
                let vp = scrollBox.getBoundingClientRect();

                let oldCenter = (scrollBox.scrollLeft + vp.width / 2)
                this.zoomTargetPos = oldCenter;

                let oldUnit = this.yearUnit;
                this.changeYearUnit(delta)
                let unitRatio = this.yearUnit / oldUnit;

                this.zoomTargetPos = oldCenter * unitRatio;
                setTimeout(function() {
                    document.getElementById('scrollmarker').scrollIntoView({ inline: 'center' })
                    app.isLoading = false;
                    app.allowZoom()
                }, 0)

            }
        },

        changeYearUnit(delta) {
            if (delta < 0) this.yearUnit = Math.max(this.minYearUnit, this.yearUnit * (1 + delta));
            if (delta > 0) this.yearUnit = Math.min(this.maxYearUnit, this.yearUnit * (1 + delta));
            // console.log(this.minYearUnit, this.yearUnit);
        },


        checkEraDuration() {
            let range = this.dateMax - this.startYear;

            this.eraDuration = 1;

            while (this.yearUnit * this.eraDuration < this.minEraWidth) {
                if (this.eraDuration % 2 == 0 || this.eraDuration == 1) {
                    this.eraDuration *= 5;
                }
                else this.eraDuration *= 2;
            }

            this.numEras = Math.ceil(range / this.eraDuration) + 2;

        },

        toggleHandwriting() {
            this.handFont = !this.handFont;
        },
        findInListById(list, id) {
            return list.filter(n => n.elId === id)[0]
        },
        openNote(shortId) {
            this.showModal = true;

            let elId = 'note_' + shortId;
            let el = document.getElementById(elId)
            if (el) {
                // console.log('scrolling to '+elId, el)
                setTimeout(function() { app.scrollToEl(el) }, 10)
            }
            else console.log('could not find id ' + elId)
        },
        closeNote() {
            this.showModal = false;
        },




        // Qwizard
        reverseCard(card) {
            card.reversed = !card.reversed;
            console.log(card.reversed)
            this.show_Qback = card.reversed;
            this.toggleReverse = !this.toggleReverse;
        }
    },

    computed: {
        eras() {
            let array = [];
            for (let i = 0; i < this.numEras; i++) {
                array.push(this.startYear + i * this.eraDuration)
            }
            return array;
        },

        timelineEls() {
            console.log('Parsing Timeline Objects')
            this.arcs.forEach(a => a.points = [])

            let events = []
            let images = []

            this.items.filter(i => i.type === 'event').forEach(event => {
                let yearInDays = (event.year - this.startYear) * 365;
                if (event.year > 0) yearInDays -= 365;
                let monthInDays = (event.month - 1) * 31;
                let days = event.day;
                event.totalDays = yearInDays + monthInDays + days;

                 event.relY = (event.pos / 100) * document.getElementById('timeline-box').offsetHeight;

                event.idString = `event_${event._id || events.length}`
                event.yearStr = event.year < 0 ?
                    -event.year + ' BC' : event.year + ' AD';

                event.dateStr = "";
                if (event.month) {
                    event.dateStr += this.MONTH[event.month];
                    if (event.day && event.day != 0) event.dateStr += ' ' + event.day
                    event.dateStr += ', ';
                }
                event.dateStr += event.yearStr;

                if (this.getArcById(event.arcId)) {
                    event.arc = this.getArcById(event.arcId)
                    event.arc.points.push({ "relY": event.relY, "relX": event.relX, "totalDays": event.totalDays })
                }

                if (event.eventType == 'image') images.push(event)
                else events.push(event)
            })

            events = events.sort((a, b) => a.totalDays - b.totalDays)

            let smallestEventDist = null;

            for (let i = 0; i < events.length; i++) {
                if (events[i - 1] && events[i - 1].arcId === events[i].arcId && Math.abs(events[i].pos - events[i - 1].pos) < this.minEventPosDiff) {
                    if (!smallestEventDist) smallestEventDist = events[i].totalDays - events[i - 1].totalDays;

                    console.log(smallestEventDist)
                    // events[i].leftNbrName = events[i-1].name

                    events[i].hasLeftNbr = true;
                    events[i - 1].hasRightNbr = true;
                    let dist = events[i].totalDays - events[i - 1].totalDays
                    events[i].daysLeft = dist;
                    events[i - 1].daysRight = dist;

                    if (dist < smallestEventDist) smallestEventDist = dist;
                }
            }

            setTimeout( function(){ app.setMaxZoom(smallestEventDist)}, 2);


            this.arcs.forEach(arc => {
                arc.type = 'arc';
                arc.points.sort((a, b) => a.totalDays - b.totalDays);
                arc.left = arc.points.reduce((min, p) => Math.min(p.totalDays, min), Infinity) - 5;
                arc.base = arc.points.reduce((min, p) => Math.min(p.relY, min), Infinity) - 5;
                arc.right = arc.points.reduce((max, p) => Math.max(p.totalDays, max), 0) + 5;
                arc.top = arc.points.reduce((max, p) => Math.max(p.relY, max), 0) + 5;
            })

            return { images, events, "arcs": this.arcs };
        },

        // noteEls(){
        //     let array = this.items.filter( i => i.type === 'note' )
        // },
        // recordEls(){
        //     return this.items.filter( i => i.type === 'record' )
        // },



        quizCards: function() {
            let id = 0;
            return this.items.reduce((acc, c) => {
                if (c.eventType === 'normal' || c.eventType === 'secondary') {
                    c.reversed = false;
                    c.id = id;
                    id++;
                    acc.push(c)
                }
                return acc;

            }, []);
        },

    }
})


document.addEventListener('keyup', e => {
    if (e.keyCode === 27 && app.showModal) { return app.closeNote() }
    else if (e.keyCode === 27 && app.theaterOn) { return app.closeTheater() }
})

window.addEventListener('resize', () => {
    setTimeout(() => {
        app.handleButtonZoom(.0001)
    })
}, 5)






function example() {
    if (false) {
        var ex = 5;
    }

    return ex;
}

console.log(example())

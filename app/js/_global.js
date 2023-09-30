// Global
app.global = {
    init: function () {
        const dates = app.global.setDate()
        let data = app.global.createData(dates);
        app.global.checkBooked(data)
        app.global.createTabs(data)
        app.global.blockOutOfDate()
        initTabs()
        initAccordions()
        initModal()
        app.global.bookPlace(data)
    },

    setDate: function () {
        const today = new Date();
        const dates = [];

        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);

            const day = nextDate.getDate();
            const month = nextDate.getMonth() + 1;
            const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}`;

            dates.push(formattedDate);
        }

        return dates;
    },

    createData: function (dates) {
        let createdData = []

        for (let i = 0, length = dates.length; i < length; i++) {
            let sessionsTemp = []
            for (let j = 0; j < 6; j++) {
                let sessionTime = 10 + (j * 2)
                let sessionId = dates[i].replace('.', '') + sessionTime
                let places = []
                let placesAmount;

                if (sessionTime == 10 || sessionTime == 20) {
                    placesAmount = 20
                } else {
                    placesAmount = 25
                }

                for (let k = 0; k < placesAmount; k++) {
                    let place = {
                        placeNum: k + 1,
                        placeBooked: false,
                        placeByer: ''
                    }

                    places.push(place)
                }

                let session = {
                    sessionID: sessionId,
                    sessionTime: `${sessionTime}:00`,
                    sessionPlaces: places
                }
                sessionsTemp.push(session)
            }

            let day = {
                date: dates[i],
                sessions: sessionsTemp
            }
            createdData.push(day)
        }

        return createdData
    },

    createTabs: function (data) {
        const tabsContainer = document.querySelector('.container .info .header')
        const tabsContentContainer = document.querySelector('.container .info')
        const tabsForDelete = document.querySelectorAll('.tabcontent')
        let tabs = ''
        let tabsContent = ''

        for (let i = 0, length = data.length; i < length; i++) {
            checked = ''
            i == 0 ? checked = 'active' : checked = 'dusabled'
            tabs += `
                <div class="header-tab ${checked}">${data[i].date}</div>
            `

            tabsContent += `
                <div class="tabcontent">
                    <div class="description">
                        <h3>Tickets for ${data[i].date}</h3>
                        ${app.global.createTimes(data[i].sessions, data[i].date)}
                    </div>
                </div>
            `
        }

        tabsContainer.innerHTML = ''
        tabsForDelete.forEach(el => el.remove())
        tabsContainer.insertAdjacentHTML('afterbegin', tabs)
        tabsContentContainer.insertAdjacentHTML('beforeend', tabsContent)
    },

    createTimes: function (sessions, date) {
        let timeAcc = '';

        for (let i = 0, length = sessions.length; i < length; i++) {
            timeAcc += `
                <div class="accordion" data-time="${sessions[i].sessionTime.split(':')[0]}">
                    <div class="accordion-item">
                        <div class="accordion-item-header">
                            ${sessions[i].sessionTime}
                        </div>
                        <div class="accordion-item-body">
                            <div class="accordion-item-body-content">
                                ${app.global.createPlaces(sessions[i].sessionPlaces, date, sessions[i].sessionTime)}    
                            </div>
                        </div>
                    </div>
                </div>
            `
        }

        return timeAcc
    },

    createPlaces: function (placesArr, date, time, name) {
        let places = ``

        for (let i = 0, length = placesArr.length; i < length; i++) {
            booked = ''
            placesArr[i].placeBooked ? booked = 'booked' : booked = ''
            places += `
                <div class="place ${booked}" id="place-${placesArr[i].placeNum}" data-date="${date}" data-time="${time}" data-place-num="${placesArr[i].placeNum}">
                    ${placesArr[i].placeNum}
                </div>
            `
        }

        return places;
    },

    setCookies: function (date, time, place, name) {
        let cookieStorage = app.global.getCookie('data')
        let newBook = {
            date: date,
            time: time,
            place: place,
            name: name
        }

        if (typeof cookieStorage == "undefined") {
            let arr = [newBook]
            document.cookie = 'data=' + JSON.stringify(arr);
        } else {
            let parsed = JSON.parse(cookieStorage)

            parsed.push(newBook)
            document.cookie = 'data=' + JSON.stringify(parsed);
        }
    },

    getCookie: function (name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },

    bookPlace: function (data) {
        const modal = document.querySelector('.modal:not(.modal-success)')
        const submitBtn = modal.querySelector('#modal-btn')
        const input = modal.querySelector('input')

        const modalSuccess = document.querySelector('.modal--success')

        submitBtn.addEventListener('click', () => {
            let date = modal.getAttribute('data-day'),
                time = modal.getAttribute('data-time'),
                place = modal.getAttribute('data-place-num'),
                name = input.value;

            input.value = ''

            modal.classList.remove('active')

            app.global.setCookies(date, time, place, name)
            app.global.init()

            modalSuccess.classList.add('active')
            setTimeout(()=>{
                modalSuccess.classList.remove('active')
            }, 2000)
        })
    },

    checkBooked: function(data){
        let cookieStorage = app.global.getCookie('data')

        if (typeof cookieStorage != "undefined") {
            let cookieStorageParsed = JSON.parse(cookieStorage)
            if(cookieStorageParsed.length > 0){
                cookieStorageParsed.forEach(value => {
                    data.forEach(el => {
                        if(el.date == value.date){
                            el.sessions.forEach(session => {
                                if(session.sessionTime == value.time){
                                    session.sessionPlaces.forEach(place => {
                                        if(place.placeNum == value.place){
                                            place.placeBooked = true
                                            place.placeByer = value.name
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            }
        }
    },

    blockOutOfDate: function(date){
        const timeHours = new Date().getHours()

        const todayTab = document.querySelector('.tabcontent')
        const times = todayTab.querySelectorAll('.accordion')

        times.forEach(el => {
            if(el.getAttribute('data-time') <= timeHours){
                el.classList.add('out-of-time')
            }
        })
    }
}

app.global.init();
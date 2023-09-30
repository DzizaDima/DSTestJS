function initTabs() {

    let tab = document.querySelectorAll('.header-tab'),
        header = document.querySelector('.header'),
        tabContent = document.querySelectorAll('.tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    function disableTabState() {
        for (let i = 0; i < tab.length; i++) {
            tab[i].classList.remove('active');
            tab[i].classList.add('disable');
        }
    }

    function updateTabState(b) {
        if (tab[b].classList.contains('disable')) {
            tab[b].classList.remove('disable');
            tab[b].classList.add('active');
        }
    }

    header.addEventListener('click', function(event) {
        let target = event.target;

        if (target && target.classList.contains('header-tab')) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    disableTabState()
                    updateTabState(i)
                    break;
                }
            }
        }

    });
}
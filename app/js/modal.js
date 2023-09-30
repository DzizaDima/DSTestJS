function initModal() {
    const modal = document.querySelector('.modal')
    const modalOverlay = modal.querySelector('.modal__overlay')

    const places = document.querySelectorAll('.place:not(.booked)')

    places.forEach(place => {
        place.addEventListener('click', (e)=>{
            modal.classList.add('active')
            modal.setAttribute('data-day', e.target.getAttribute('data-date'))
            modal.setAttribute('data-place-num', e.target.getAttribute('data-place-num'))
            modal.setAttribute('data-time', e.target.getAttribute('data-time'))
        })
    })

    modalOverlay.addEventListener('click', ()=>{
        modal.classList.remove('active')
    })

    const modalSuccess = document.querySelector('.modal--success')
    const modalOverlaySuccess = modalSuccess.querySelector('.modal__overlay')

    modalOverlaySuccess.addEventListener('click', ()=>{
        modalSuccess.classList.remove('active')
    })
}
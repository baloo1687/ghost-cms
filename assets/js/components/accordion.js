export const accordion = () => {
  const accordionSections = [...document.querySelectorAll('.js-accordion')];

  accordionSections.forEach(accrodionSection => {
    const accordionList = [...accrodionSection.querySelectorAll('.js-accordion-name')];

    accordionList.forEach(accordion => {
      accordion.addEventListener('click', e => {
        const accordionItem = accordion.closest('.js-accordion-item');
        const accordionContent = accordionItem.querySelector('.js-accordion-content');
        
        accordionItem.classList.toggle('active');
    
        if (accordionItem.matches('.active')) {
          accordionContent.style.height = 'auto';
          accordionContent.style.display = 'block';
          let height = accordionContent.clientHeight + "px";
          accordionContent.style.height = 0;
    
          setTimeout(function () {
            accordionContent.style.height = height;
          }, 0);
        } else {
          accordionContent.style.height = '0px';
        }
      })
    })
  })
}


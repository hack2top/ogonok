import { onBeforeUnmount, onMounted } from 'vue'

export function useScrollAnimation() {
  let observer

  onMounted(() => {
    const elements = document.querySelectorAll('[data-reveal], [data-aos]')
    if (!elements.length) return

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' })

    elements.forEach((element, index) => {
      const delay = element.dataset.aosDelay ?? String(Math.min(index % 4, 3) * 90)
      element.style.setProperty('--reveal-delay', `${Number(delay) || 0}ms`)
      observer.observe(element)
    })
  })

  onBeforeUnmount(() => observer?.disconnect())
}

const mobileBreakPoint = 375
const desktopBreakPoint = 768

export const mediaMobile = `@media screen and (max-width: ${mobileBreakPoint}px)`
export const mediaMobileAndTablet = `@media screen and (max-width: ${desktopBreakPoint}px)`
export const mediaTablet = `@media screen and (min-width: ${mobileBreakPoint}px) and (max-width: ${desktopBreakPoint}px)`
export const mediaTabletAndDesktop = `@media screen and (min-width: ${mobileBreakPoint}px)`
export const mediaDesktop = `@media screen and (min-width: ${desktopBreakPoint}px)`

export function isMobile(): boolean {
  return window.matchMedia(`(max-width: ${mobileBreakPoint}px)`).matches
}

export function isMobileAndTablet(): boolean {
  return window.matchMedia(`(max-width: ${desktopBreakPoint}px)`).matches
}

export function isTablet(): boolean {
  return (
    window.matchMedia(`(min-width: ${mobileBreakPoint}px)`).matches
    && window.matchMedia(`(max-width: ${desktopBreakPoint}px)`).matches
  )
}

export function isTabletAndDesktop(): boolean {
  return window.matchMedia(`(min-width: ${mobileBreakPoint}px)`).matches
}

export function isDesktop(): boolean {
  return window.matchMedia(`(min-width: ${desktopBreakPoint}px)`).matches
}

export type MediaQueryState = 'mobile' | 'tablet' | 'desktop'

export function isWhat(): MediaQueryState {
  if (isMobile()) {
    return 'mobile'
  }
  if (isTablet()) {
    return 'tablet'
  }
  return 'desktop'
}

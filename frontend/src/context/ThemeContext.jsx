import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({children}){
  const [theme, setTheme] = useState(() => localStorage.getItem('5g-theme') || 'dark')

  useEffect(() => {
    localStorage.setItem('5g-theme', theme)
    document.body.classList.toggle('theme-light', theme === 'light')
    document.body.classList.toggle('theme-dark', theme === 'dark')
  }, [theme])

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(current => current === 'dark' ? 'light' : 'dark')
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(){
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}

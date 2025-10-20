import React from 'react'

const Header = () => {
  return (
    <header className="bg-[var(--primary-color)] h-full text-[var(--text-color)] py-4 px-6 shadow-md flex items-center">
      <h1 className="text-4xl mobile:text-xl tablet:text-2xl font-bold tracking-wide">Inventory & Sales Management</h1>
    </header>
  )
}

export default Header

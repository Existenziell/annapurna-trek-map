const Layout = ({ children }) => {
  return (
    <>
      <main className='w-full text-center bg-cloth-pattern bg-repeat dark:bg-none dark:bg-brand-dark dark:text-gray-300'>
        {children}
      </main>
    </>
  )
}

export default Layout

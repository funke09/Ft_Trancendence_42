import Navbar from '@/components/Layout/NavBar'
import store from '@/redux/store'
import React from 'react'

function Dashboard() {
  return (
	<>
	<Navbar/>
	<div className='justify-center'>Dashboard</div>
	</>
  )
}

export default Dashboard
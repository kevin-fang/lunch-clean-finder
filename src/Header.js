import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
    <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/name">Name</Link></li>
        <li><Link to="/team">Team</Link></li>
    </ul>
)

export default Header
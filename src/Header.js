import React from 'react'
import { Link, Redirect } from 'react-router-dom'

// material-ui stuff
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import MenuItem from 'material-ui/MenuItem'

const noLinkUnderline = { 
    textDecoration: 'none' 
}

export default class Header extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false,
			redirect: null
		}
		this.handleMenuClick = this.handleMenuClick.bind(this)
		this.openDrawer = this.openDrawer.bind(this)
	}

	openDrawer() {
		this.setState({
			open: true
		})
	}

	handleMenuClick(e) {
		this.setState({
			open: false
		})
	}
    render() {
        if (this.state.redirect !== null) {
            return <Redirect to={`/${this.state.redirect}`} />
        }

        return (
            <div>
                <AppBar title="Commonwealth School Student Jobs" onLeftIconButtonTouchTap={this.openDrawer} />
                <Drawer
                    open={this.state.open}
                    docked={false}
                    onRequestChange={(open) => this.setState({open: open})}>
                    <Link to='/' style={noLinkUnderline}><MenuItem onClick={this.handleMenuClick}>Home</MenuItem></Link>
                    <Link to='/name' style={noLinkUnderline}><MenuItem onClick={this.handleMenuClick}>Name Search</MenuItem></Link>
                    <Link to='/team' style={noLinkUnderline}><MenuItem onClick={this.handleMenuClick}>Team Search</MenuItem></Link>
                </Drawer>
            </div>
        )
    }
}
/*

            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/name">Name</Link></li>
                <li><Link to="/team">Team</Link></li>
            </ul>
            */
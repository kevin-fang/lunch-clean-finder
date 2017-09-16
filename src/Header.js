import React from 'react'
import { Link, Redirect } from 'react-router-dom'

// material-ui stuff
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import MenuItem from 'material-ui/MenuItem'
import Home from 'material-ui-icons/Home'
import Search from 'material-ui-icons/Search'
import Info from 'material-ui-icons/Info'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import SvgIcon from 'material-ui/SvgIcon'

const noLinkUnderline = { 
    textDecoration: 'none' 
}

const TeamIcon = (props) => (
    <SvgIcon {...props}>
        <path fill="#000000" d="M6,11A2,2 0 0,1 8,13V17H4A2,2 0 0,1 2,15V13A2,2 0 0,1 4,11H6M4,13V15H6V13H4M20,13V15H22V17H20A2,2 0 0,1 18,15V13A2,2 0 0,1 20,11H22V13H20M12,7V11H14A2,2 0 0,1 16,13V15A2,2 0 0,1 14,17H12A2,2 0 0,1 10,15V7H12M12,15H14V13H12V15Z" />
    </SvgIcon>
)

export default class Header extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			infoOpen: false,
			redirect: null
		}
		this.handleMenuClick = this.handleMenuClick.bind(this)
        this.openDrawer = this.openDrawer.bind(this)
        this.displayInfo = this.displayInfo.bind(this)
        this.handleClose = this.handleClose.bind(this)
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
    
    handleClose() {
        this.setState({infoOpen: false})
    }
    
    displayInfo() {
        this.setState({infoOpen: true})
    }

    render() {
        const actions = [
            <FlatButton
                label="Dismiss"
                secondary={true}
                onClick={this.handleClose}
            />
        ]
        if (this.state.redirect !== null) {
            return <Redirect to={`/${this.state.redirect}`} />
        }
        return (
            <div>
                <AppBar title="Commonwealth School Student Jobs" 
                    onLeftIconButtonTouchTap={this.openDrawer} 
                    iconElementRight={
                        <FlatButton 
                            icon={<Info />}
                        />}
                    onRightIconButtonTouchTap={(event) => this.displayInfo()}
                />
                <Dialog
                    open={this.state.infoOpen}
                    title="About"
                    actions={actions}
                    contentStyle={{width: '30%'}}
                    onRequestClose={this.handleClose}>
                        Made by <b>Kevin Fang</b>, class of 2018<br/>
                        <ul style={{padding: 8, margin: 0}}>
                            <li><b>React.js</b>, v15.6.1</li>
                            <li><b>Node.js</b>, v7.8.0</li>
                        </ul>
                </Dialog>
                <Drawer
                    open={this.state.open}
                    docked={false}
                    onRequestChange={(open) => this.setState({open: open})}>
                    <AppBar title="Navigation" showMenuIconButton={false} /><br/>
                    <Link to='/' style={noLinkUnderline}><MenuItem leftIcon={<Home />} onClick={this.handleMenuClick}>Home</MenuItem></Link>
                    <Link to='/name' style={noLinkUnderline}><MenuItem leftIcon={<Search />} onClick={this.handleMenuClick}>Name Search</MenuItem></Link>
                    <Link to='/team' style={noLinkUnderline}><MenuItem leftIcon={<TeamIcon />} onClick={this.handleMenuClick}>Team Search</MenuItem></Link>
                </Drawer>
            </div>
        )
    }
}
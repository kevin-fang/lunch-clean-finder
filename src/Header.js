import React from 'react'
import { Link } from 'react-router-dom'

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

// disable underline for navigation bar
const noLinkUnderline = { 
    textDecoration: 'none' 
}

// the 'abc' vector icon
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
		}
		this.handleMenuClick = this.handleMenuClick.bind(this)
        this.openNavMenu = this.openNavMenu.bind(this)
        this.openInfoDialog = this.openInfoDialog.bind(this)
        this.handleDialogClose = this.handleDialogClose.bind(this)
	}


	openNavMenu() {this.setState({open: true})}

    // handle a click in the navigation menu; close the menu
	handleMenuClick(e) {this.setState({open: false})}
    
    // handle dialog close
    handleDialogClose() {this.setState({infoOpen: false})}

    // handle dialog open
    openInfoDialog() {this.setState({infoOpen: true})}

    render() {
        // actions in the info dialog
        const actions = [
            <FlatButton
                label={<b>Dismiss</b>}
                secondary={true}
                onClick={this.handleDialogClose}
            />
        ]

        return (
            <div> 
                {/* Render the application bar with info button and navigation menu*/}
                <AppBar title="Student Jobs - Commonwealth School" 
                    onLeftIconButtonTouchTap={this.openNavMenu} 
                    iconElementRight={
                        <FlatButton 
                            icon={<Info />}
                        />}
                    onRightIconButtonTouchTap={(event) => this.openInfoDialog()}
                />
                {/* Info dialog */}
                <Dialog
                    open={this.state.infoOpen}
                    title={<div><b>About</b></div>}
                    actions={actions}
                    contentStyle={{width: 300}}
                    onRequestClose={this.handleDialogClose}>
                        Made by <b>Kevin Fang</b>, class of 2018<br/>
                        <ul style={{padding: 8, margin: 4}}>
                            <li><b>React.js</b>, v15.6.1</li>
                            <li><b>Node.js</b>, v7.8.0</li>
                            <li><a href="https://github.com/kevin-fang/student-jobs-finder" target="_blank" rel="noopener noreferrer">Source code avaliable on GitHub</a></li>
                        </ul>
                </Dialog>
                {/* Create the navigation menu */}
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
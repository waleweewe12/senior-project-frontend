import React from 'react'
import {Link} from 'react-router-dom'
import {Nav, Navbar} from 'react-bootstrap'

const linkStyle = {
    marginLeft:'10px',
    textDecoration:'none',
    color:'white'
}

function myNavbar(){
    return(
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand><Link style={linkStyle} to="/">Venomous Snake</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link style={linkStyle} to="/">Home</Link>
                        <Link style={linkStyle}  to="/addimage">Add Image</Link>
                        <Link style={linkStyle}  to="/userresult">User Result</Link>
                        <Link style={linkStyle}  to="/model">Model</Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default myNavbar;